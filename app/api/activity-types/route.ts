import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import type { RowDataPacket } from "mysql2";

interface ActivityTypeRow extends RowDataPacket {
  id: string;
  name: string;
  color: string;
}

// GET all activity types
export async function GET() {
  try {
    const [rows] = await pool.query<ActivityTypeRow[]>(
      "SELECT id, name, color FROM activity_types ORDER BY created_at ASC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching activity types:", error);
    return NextResponse.json(
      { error: "Errore nel recupero delle tipologie" },
      { status: 500 }
    );
  }
}

// POST create new activity type
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: "Nome e colore sono richiesti" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    await pool.query(
      "INSERT INTO activity_types (id, name, color) VALUES (?, ?, ?)",
      [id, name, color]
    );

    return NextResponse.json({ id, name, color }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity type:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della tipologia" },
      { status: 500 }
    );
  }
}
