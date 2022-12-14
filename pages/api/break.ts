import type { NextApiRequest } from "next"
import { CustomNextApiResponse } from "../../lib"
import { goToPose } from "../../lib/edelkrone"

export default async function handler(
  _req: NextApiRequest,
  res: CustomNextApiResponse
) {
  try {
    await goToPose(0)
    await res.server.obs.transition("Break")
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }

  res.status(200).end()
}
