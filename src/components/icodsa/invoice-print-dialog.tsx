import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  InvoicePdfViewer,
  SingleInvoicePdfViewer,
  InvoicePdfDocument,
  SingleInvoicePdfDocument,
} from "./invoice-pdf"
import { Invoice } from "./invoice-table"
import { Download } from "lucide-react"
import { downloadPDF } from "@/lib/pdf-utils"

interface PrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Invoice[] | Invoice
  title: string
  description?: string
  singleMode?: boolean
}

export function InvoicePrintDialog({
  open,
  onOpenChange,
  data,
  title,
  description,
  singleMode = false,
}: PrintDialogProps) {
  const handleDownload = async () => {
    if (singleMode && !Array.isArray(data)) {
      await downloadPDF(
        <SingleInvoicePdfDocument invoice={data} />,
        `invoice-${data.invoiceNumber}.pdf`
      )
    } else {
      await downloadPDF(
        <InvoicePdfDocument invoices={Array.isArray(data) ? data : [data]} />,
        "icodsa-invoices.pdf"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='py-4'>
          {singleMode && !Array.isArray(data) ? (
            <SingleInvoicePdfViewer invoice={data} />
          ) : (
            <InvoicePdfViewer invoices={Array.isArray(data) ? data : [data]} />
          )}
        </div>
        <DialogFooter className='flex gap-2'>
          <Button
            variant='outline'
            onClick={handleDownload}
            className='flex items-center'
          >
            <Download className='mr-2 h-4 w-4' />
            Download PDF
          </Button>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
