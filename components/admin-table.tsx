'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

type Booking = {
  id: string
  date: string
  school_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  comments: string | null
  created_at: string
}

export function AdminTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookings:', error)
      } else {
        setBookings(data)
      }
      setLoading(false)
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>School Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
              <TableCell>{booking.school_name}</TableCell>
              <TableCell>{booking.contact_name}</TableCell>
              <TableCell>{booking.contact_email}</TableCell>
              <TableCell>{booking.contact_phone}</TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{booking.comments}</div>
              </TableCell>
              <TableCell>
                <Button>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
