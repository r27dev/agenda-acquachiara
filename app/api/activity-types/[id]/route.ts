import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface CountRow extends RowDataPacket {
  count: number;
}

interface FirstTypeRow extends RowDataPacket {
  id: string;
}

// PUT update activity type
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: "Nome e colore sono richiesti" },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE activity_types SET name = ?, color = ? WHERE id = ?",
      [name, color, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Tipologia non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id, name, color });
  } catch (error) {
    console.error("Error updating activity type:", error);
    return NextResponse.json(
      { error: "Errore nell'aggiornamento della tipologia" },
      { status: 500 }
    );
  }
}

// DELETE activity type
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if this is the last type
    const [countResult] = await pool.query<CountRow[]>(
      "SELECT COUNT(*) as count FROM activity_types"
    );

    if (countResult[0].count <= 1) {
      return NextResponse.json(
        { error: "Non puoi eliminare l'ultima tipologia" },
        { status: 400 }
      );
    }

    // Get the first type that isn't the one being deleted (for reassignment)
    const [firstType] = await pool.query<FirstTypeRow[]>(
      "SELECT id FROM activity_types WHERE id != ? LIMIT 1",
      [id]
    );

    if (firstType.length > 0) {
      // Reassign activities to the first available type
      await pool.query("UPDATE activities SET type_id = ? WHERE type_id = ?", [
        firstType[0].id,
        id,
      ]);
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM activity_types WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Tipologia non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity type:", error);
    return NextResponse.json(
      { error: "Errore nell'eliminazione della tipologia" },
      { status: 500 }
    );
  }
}
