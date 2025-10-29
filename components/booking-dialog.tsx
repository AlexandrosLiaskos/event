"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  schoolName: z.string().min(2, "Το όνομα του σχολείου είναι υποχρεωτικό"),
  contactName: z.string().min(2, "Το όνομα επικοινωνίας είναι υποχρεωτικό"),
  contactEmail: z.string().email("Μη έγκυρη διεύθυνση email").min(1, "Το email είναι υποχρεωτικό"),
  contactPhone: z.string().optional(),
  comments: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: string | null
  selectedDisplayDate: string
}

export function BookingDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedDisplayDate,
}: BookingDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      schoolName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      comments: "",
    },
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      form.reset()
      setErrorMessage(null)
      setSuccessMessage(null)
    }
  }, [open, form])

  const onSubmit = async (data: FormData) => {
    if (!selectedDate) return

    setErrorMessage(null)

    try {
      const response = await fetch('/api/submit-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          selectedDate,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage("Η κράτηση υποβλήθηκε επιτυχώς!")
        setTimeout(() => onOpenChange(false), 1500)
      } else {
        setErrorMessage(result.error || "Σφάλμα κατά την υποβολή")
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      setErrorMessage("Σφάλμα κατά την υποβολή της κράτησης")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 sm:mx-auto rounded-lg">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Κράτηση Ημερομηνίας
          </DialogTitle>
          <DialogDescription className="text-sm pt-1">
            <span className="font-medium text-foreground">Επιλεγμένη ημερομηνία:</span>
            <br />
            <span className="text-muted-foreground mt-1 block">{selectedDisplayDate}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold mb-1">Σφάλμα</p>
              <p>{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold mb-1">Επιτυχία</p>
              <p>{successMessage}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Όνομα Σχολείου *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Όνομα Υπευθύνου Επικοινωνίας *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Τηλέφωνο Επικοινωνίας
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Σχόλια
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Email Επικοινωνίας *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="h-10 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-10 px-6 rounded-md"
                >
                  Ακύρωση
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-10 px-6 rounded-md"
                >
                  {form.formState.isSubmitting ? "Υποβολή..." : "Υποβολή Κράτησης"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
