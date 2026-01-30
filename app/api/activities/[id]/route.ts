import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

// DELETE activity
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM activities WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Attività non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Errore nell'eliminazione dell'attività" },
      { status: 500 }
    );
  }
}

// PUT update activity
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, date, typeId } = body;

    if (!title || !date || !typeId) {
      return NextResponse.json(
        { error: "Titolo, data e tipologia sono richiesti" },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE activities SET title = ?, description = ?, date = ?, type_id = ? WHERE id = ?",
      [title, description || null, date, typeId, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Attività non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id,
      title,
      description: description || undefined,
      date,
      typeId,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Errore nell'aggiornamento dell'attività" },
      { status: 500 }
    );
  }
}
