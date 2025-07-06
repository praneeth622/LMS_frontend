"use client"

import * as React from "react"
import { Download, FileText, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ExportButtonProps {
  data: any[]
  filename?: string
  elementId?: string
}

export function ExportButton({ data, filename = "analytics-data", elementId }: ExportButtonProps) {
  const exportToCSV = () => {
    try {
      if (!data || data.length === 0) {
        toast.error('No data to export')
        return
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value
          }).join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Data exported to CSV successfully!')
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      toast.error('Failed to export data')
    }
  }

  const exportToJSON = () => {
    try {
      if (!data || data.length === 0) {
        toast.error('No data to export')
        return
      }

      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Data exported to JSON successfully!')
    } catch (error) {
      console.error('Error exporting to JSON:', error)
      toast.error('Failed to export data')
    }
  }

  const exportToPDF = async () => {
    try {
      if (!elementId) {
        toast.error('No element specified for PDF export')
        return
      }

      const element = document.getElementById(elementId)
      if (!element) {
        toast.error('Element not found for PDF export')
        return
      }

      toast.loading('Generating PDF...')
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4')
      const imgWidth = 297
      const pageHeight = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${filename}.pdf`)
      toast.dismiss()
      toast.success('PDF exported successfully!')
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      toast.dismiss()
      toast.error('Failed to export PDF')
    }
  }

  const exportAsImage = async () => {
    try {
      if (!elementId) {
        toast.error('No element specified for image export')
        return
      }

      const element = document.getElementById(elementId)
      if (!element) {
        toast.error('Element not found for image export')
        return
      }

      toast.loading('Generating image...')
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL()
      link.click()
      
      toast.dismiss()
      toast.success('Image exported successfully!')
    } catch (error) {
      console.error('Error exporting image:', error)
      toast.dismiss()
      toast.error('Failed to export image')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        {elementId && (
          <>
            <DropdownMenuItem onClick={exportToPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsImage}>
              <Image className="mr-2 h-4 w-4" />
              Export as Image
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}