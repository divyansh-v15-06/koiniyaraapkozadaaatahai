"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { Student } from "@/lib/types";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [showCsvModal, setShowCsvModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: any[] = results.data;
        if (!rows || rows.length === 0) {
          toast.error("CSV file is empty");
          return;
        }
        const newStudents: Student[] = rows.map((r, i) => ({
          id: `s-import-${Date.now()}-${i}`,
          department_id: "22222222-2222-2222-2222-222222222222",
          programme_id: r.programme || r.programme_id || "btech",
          name: r.name || r.student_name || "Unknown Student",
          roll_number: r.roll_number || r.roll || `ROLL-${i + 100}`,
          email: r.email || "",
          batch_year: Number(r.batch_year || r.year || 2024),
          cgpa: Number(r.cgpa || 8.0),
        }));

        setStudents([...newStudents, ...students]);
        setShowCsvModal(false);
        toast.success(`Successfully imported ${newStudents.length} students from CSV!`);
      },
      error: (err) => {
        toast.error(`CSV Parsing error: ${err.message}`);
      },
    });
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Management &amp; CSV Import</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage enrolled students and perform batch CSV uploads.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowCsvModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <UploadCloud className="h-4 w-4" /> Batch CSV Import
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or roll number..."
            className="w-full max-w-md rounded-xl border border-input bg-background py-2 px-4 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-accent/30 transition">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{s.roll_number}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{s.name}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold text-muted-foreground">{s.programme_id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.batch_year}</td>
                  <td className="px-6 py-4 font-mono font-semibold">{s.cgpa || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setStudents(students.filter((x) => x.id !== s.id));
                        toast.success("Student removed");
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-2">Import Students via CSV</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Upload a .csv file containing columns: <code>name</code>, <code>roll_number</code>, <code>programme</code>, <code>batch_year</code>, <code>cgpa</code>.
            </p>

            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center cursor-pointer hover:bg-primary/10 transition">
              <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
              <span className="text-sm font-bold text-foreground">Click to select CSV File</span>
              <span className="text-xs text-muted-foreground mt-1">Accepts UTF-8 .csv files</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
