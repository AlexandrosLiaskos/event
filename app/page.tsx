import { supabase } from '@/lib/supabase'
import { BookingTable } from '@/components/booking-table'

export const revalidate = 60 // Revalidate data every 60 seconds

async function getEventDates() {
  const { data, error } = await supabase.rpc('get_date_slot_counts')

  if (error) {
    console.error('Error fetching slot counts:', error)
    // Return a default structure in case of error
    return [
      { date: '2026-02-02', displayDate: '', count: 0 },
      { date: '2026-02-03', displayDate: '', count: 0 },
      { date: '2026-02-04', displayDate: '', count: 0 },
      { date: '2026-02-05', displayDate: '', count: 0 },
      { date: '2026-02-06', displayDate: '', count: 0 },
    ]
  }

  return data.map((item: { date: string; count: number }) => ({
    ...item,
    displayDate: '' // displayDate will be generated on the client
  }))
}

export default async function Page() {
  const eventDates = await getEventDates()

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="border-b border-border bg-background flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Δραστηριότητες Γεωλογίας και Γεωπεριβάλλοντος
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              2-6 Φεβρουαρίου 2026
            </p>
          </div>
          <img src="https://www.geol.uoa.gr/typo3conf/ext/uoa_website/Resources/Public/Images/footer_logo.png" alt="University Logo" className="h-12" />
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="space-y-4 sm:space-y-5">
            {/* Introduction */}
            <div className="text-center space-y-1.5">
              <img src="https://www.geol.uoa.gr/fileadmin/uploads/tx_gridelements/logo_geol_01.png" alt="Department Logo" className="mx-auto h-24" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Επιλέξτε Ημερομηνία
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Παρακαλούμε επιλέξτε μία από τις διαθέσιμες ημερομηνίες για το σχολείο σας.
                Κάθε ημερομηνία έχει περιορισμένες θέσεις (μέγιστο 2 σχολεία, 60 μαθητές ανά σχολείο).
              </p>
            </div>

            {/* Table Section */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <BookingTable initialEventDates={eventDates} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="border-t border-border bg-background flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center space-y-0.5">
            <p className="text-xs sm:text-sm font-medium">
              Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Τμήμα Γεωλογίας και Γεωπεριβάλλοντος
            </p>
            <p className="text-xs text-muted-foreground">
              Email: contact@geol.uoa.gr
            </p>
            <p className="text-xs text-muted-foreground">
              Copyright © 2025 Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

