import { cn } from '@/lib/utils/cn'

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-brand-muted/20">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-brand-darker border-b border-brand-muted/20', className)} {...props}>
      {children}
    </thead>
  )
}

export function Tbody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-brand-muted/10', className)} {...props}>
      {children}
    </tbody>
  )
}

export function Tr({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-brand-mid/30 transition-colors duration-150', className)} {...props}>
      {children}
    </tr>
  )
}

export function Th({ className, children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider', className)}
      {...props}
    >
      {children}
    </th>
  )
}

export function Td({ className, children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 text-brand-light', className)} {...props}>
      {children}
    </td>
  )
}
