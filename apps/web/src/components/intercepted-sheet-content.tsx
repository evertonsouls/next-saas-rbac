'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

import {
  SheetContentProps,
  SheetOverlay,
  SheetPortal,
  sheetVariants,
} from './ui/sheet'

const InterceptedSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
InterceptedSheetContent.displayName = SheetPrimitive.Content.displayName

export { InterceptedSheetContent }
