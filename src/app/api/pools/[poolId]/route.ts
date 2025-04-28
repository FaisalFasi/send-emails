import { db } from "../../../../../firebase/server";
import { NextResponse } from "next/server";
import { admin } from "../../../../../firebase/server";

// PUT: Update a Pool by ID
export async function PUT(
  req: Request,
  { params }: { params: { poolId: string } }
) {
  try {
    const poolId = await params.poolId; // Get pool ID from URL params
    const data = await req.json(); // Get the updated pool data from the request body
    console.log("Received data to update:", data);

    // Check if poolId is valid
    if (!poolId || !data) {
      return NextResponse.json(
        { error: "Pool ID and data are required" },
        { status: 400 }
      );
    }

    // Check if the pool exists
    const poolDocRef = db.collection("Pools").doc(poolId);
    const poolDoc = await poolDocRef.get();
    if (!poolDoc.exists) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    // Update the pool in Firestore
    const timestampNow = admin.firestore.Timestamp.now();
    const dataWithTimestamps = {
      ...data,
      updatedAt: timestampNow,
    };

    await poolDocRef.update(dataWithTimestamps);

    return NextResponse.json(
      { message: "Pool updated successfully", id: poolId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pool:", error);
    return NextResponse.json(
      { error: "Failed to update pool" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Pool by ID

export async function DELETE(
  request: Request,
  { params }: { params: { poolId: string } }
) {
  try {
    // Proper way to access params in Next.js 13+ App Router
    const poolId = params.poolId;
    console.log("Received poolId to delete:", poolId);

    if (!poolId || poolId === "0") {
      return NextResponse.json(
        { error: "Valid Pool ID is required" },
        { status: 400 }
      );
    }

    const poolDocRef = db.collection("Pools").doc(poolId);
    const poolDoc = await poolDocRef.get();

    if (!poolDoc.exists) {
      return NextResponse.json(
        { error: `Pool with ID ${poolId} not found` },
        { status: 404 }
      );
    }

    await poolDocRef.delete();

    return NextResponse.json(
      { message: "Pool deleted successfully", id: poolId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pool:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function DELETE(req: Request) {
//   try {
//     const { poolId } = await req.json(); // Assuming poolId is sent in the request body
//     console.log("Received poolId to delete:", poolId);

//     // Make sure the poolId is valid
//     if (!poolId) {
//       return NextResponse.json(
//         { error: "Pool ID is required" },
//         { status: 400 }
//       );
//     }

//     // Delete the pool from Firestore
//     const poolDocRef = await db.collection("Pools").doc(poolId);

//     // Check if the pool exists first
//     const poolDoc = await poolDocRef.get();
//     if (!poolDoc.exists) {
//       return NextResponse.json({ error: "Pool not found" }, { status: 404 });
//     }

//     // Delete the pool
//     await poolDocRef.delete();

//     return NextResponse.json(
//       { message: "Pool deleted successfully", id: poolId },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting pool:", error);
//     return NextResponse.json(
//       { error: "Failed to delete pool" },
//       { status: 500 }
//     );
//   }
// }
