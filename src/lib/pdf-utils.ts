import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import { ReactElement } from "react"

export async function downloadPDF(
  document: ReactElement<any, any>,
  filename: string
) {
  const blob = await pdf(document).toBlob()
  saveAs(blob, filename)
}
