import { Accessibility, Dev } from '@/objects'
import { Pager } from './PaginationEnum'

/**
 * Pagination Interface
 */
export interface PaginationProps extends Accessibility, Dev {
  length: number
  defaultPage?: number
  pageSize?: number
  onClick?: (pager: Pager) => void
  className?: string
  href?: (page: number) => string
}
