export const dateHelpers = {
  getDateRange: (
    from_date: string | Date | undefined,
    to_date: string | Date | undefined,
  ) => {
    if (!from_date && !to_date) {
      return undefined
    }
    return {
      gte: from_date ? new Date(from_date) : undefined,
      lte: to_date ? new Date(to_date) : undefined,
    }
  },
}
