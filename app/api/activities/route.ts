import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import type { RowDataPacket } from "mysql2";

interface ActivityRow extends RowDataPacket {
  id: string;
  title: string;
  description: string | null;
  date: string;
  type_id: string;
}

// GET activities (with optional month/year filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let query = `
      SELECT id, title, description, DATE_FORMAT(date, '%Y-%m-%d') as date, type_id 
      FROM activities
    `;
    const queryParams: (string | number)[] = [];

    if (month && year) {
      query += " WHERE MONTH(date) = ? AND YEAR(date) = ?";
      queryParams.push(parseInt(month) + 1, parseInt(year));
    }

    query += " ORDER BY date ASC";

    const [rows] = await pool.query<ActivityRow[]>(query, queryParams);

    // Transform to match frontend format
    const activities = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      date: row.date,
      typeId: row.type_id,
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Errore nel recupero delle attività" },
      { status: 500 }
    );
  }
}

// POST create new activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, typeId } = body;

    if (!title || !date || !typeId) {
      return NextResponse.json(
        { error: "Titolo, data e tipologia sono richiesti" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    await pool.query(
      "INSERT INTO activities (id, title, description, date, type_id) VALUES (?, ?, ?, ?, ?)",
      [id, title, description || null, date, typeId]
    );

    return NextResponse.json(
      {
        id,
        title,
        description: description || undefined,
        date,
        typeId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Errore nella creazione dell'attività" },
      { status: 500 }
    );
  }
}
