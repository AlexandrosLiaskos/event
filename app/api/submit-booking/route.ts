import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolName, contactName, contactEmail, contactPhone, comments, selectedDate } = body

    // Validate input
    if (!schoolName || !contactName || !contactEmail || !selectedDate) {
      return NextResponse.json(
        { success: false, error: 'Όλα τα πεδία είναι υποχρεωτικά' },
        { status: 400 }
      )
    }

    // Check current slot count
    const { data: countData, error: countError } = await supabase
      .rpc('get_slot_count', { event_date: selectedDate })

    if (countError) {
      console.error('Error fetching slot count:', countError)
      return NextResponse.json(
        { success: false, error: 'Σφάλμα κατά την ανάκτηση διαθέσιμων θέσεων' },
        { status: 500 }
      )
    }

    if (countData >= 2) {
      return NextResponse.json(
        { success: false, error: 'Δεν υπάρχουν διαθέσιμες θέσεις για αυτή την ημερομηνία' },
        { status: 400 }
      )
    }

    // Insert booking
    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        date: selectedDate,
        school_name: schoolName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        comments: comments,
      })

    if (insertError) {
      console.error('Error inserting booking:', insertError)
      return NextResponse.json(
        { success: false, error: 'Σφάλμα κατά την υποβολή της κράτησης' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Ένα απροσδόκητο σφάλμα συνέβη' },
      { status: 500 }
    )
  }
}

