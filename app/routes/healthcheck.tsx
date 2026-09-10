import db from "../db.server";

export const loader = async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", time: new Date().toISOString() });
  } catch (error) {
    return Response.json({ status: "error", error: String(error) }, { status: 500 });
  }
};
