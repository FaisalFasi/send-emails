// app/api/founders/[founderId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { founderId: string } }
) {
  // Fetch data for this founder
  return Response.json({
    /* your data */
  });
}
