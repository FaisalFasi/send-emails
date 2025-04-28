import { NextResponse } from "next/server";
import { admin, db } from "../../../../firebase/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const timestampNow = admin.firestore.Timestamp.now();

    // Add timestamp if not provided
    const dataWithTimestamps = {
      ...data,
      createdAt: data.createdAt || timestampNow,
      updatedAt: timestampNow,
    };
    console.log("Data with timestamps:", dataWithTimestamps);

    // const docRef = await addDoc(
    //   collection(db, "investors"),
    //   dataWithTimestamps
    // );

    const docRef = await db
      .collection("InvestorsProfile")
      .add(dataWithTimestamps);

    return NextResponse.json(
      {
        id: docRef.id,
        ...dataWithTimestamps,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { error: "Failed to add investor data" },
      { status: 500 }
    );
  }
}

// ✅ Add this for GET
export async function GET() {
  try {
    const snapshot = await db
      .collection("InvestorsProfile")
      .orderBy("createdAt", "desc")
      .get();

    console.log("Snapshot data:", snapshot);

    const investors = snapshot?.docs?.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Investors data:", investors);

    return NextResponse.json(investors, { status: 200 });
  } catch (error) {
    console.error("Error fetching investors:", error);
    return NextResponse.json(
      { error: "Failed to fetch investors" },
      { status: 500 }
    );
  }
}
