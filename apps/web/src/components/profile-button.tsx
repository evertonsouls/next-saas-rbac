import { ChevronDown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'

export function ProfileButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">Everton Pereira</span>
          <span className="text-xs text-zinc-400">everton@acme.com</span>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/evertonsouls.png" />
          <AvatarFallback>EP</AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
