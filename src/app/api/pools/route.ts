import { db } from "../../../../firebase/server";
import { NextResponse } from "next/server";
import { admin } from "../../../../firebase/server";

// POST: Create a Pool
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const timestampNow = admin.firestore.Timestamp.now();

    const dataWithTimestamps = {
      ...data,
      createdAt: timestampNow,
      updatedAt: timestampNow,
    };

    const docRef = await db
      .collection("Pools")
      .doc(data.id)
      .set(dataWithTimestamps);

    return NextResponse.json(
      { message: "Pool created", id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pool:", error);
    return NextResponse.json(
      { error: "Failed to create pool" },
      { status: 500 }
    );
  }
}

// GET: Fetch all Pools
export async function GET() {
  try {
    const snapshot = await db
      .collection("Pools")
      .orderBy("createdAt", "desc")
      .get();
    const pools = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(pools, { status: 200 });
  } catch (error) {
    console.error("Error fetching pools:", error);
    return NextResponse.json(
      { error: "Failed to fetch pools" },
      { status: 500 }
    );
  }
}

// Update a specific Pool
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const data = await req.json();
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ error: "Pool ID missing" }, { status: 400 });
//     }

//     await db
//       .collection("Pools")
//       .doc(id)
//       .update({
//         ...data,
//         updatedAt: new Date(),
//       });

//     return NextResponse.json(
//       { message: "Pool updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating pool:", error);
//     return NextResponse.json(
//       { error: "Failed to update pool" },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Delete a Pool by ID
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
//     const poolDocRef = db.collection("Pools").doc(poolId);

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
