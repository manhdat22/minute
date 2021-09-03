import TimeAgo from 'javascript-time-ago'

export const formatDate = (t: string): string => {
  return new Date(t).toLocaleDateString()
}

export const formatTimeAgo = (t: string): string => {
  return new TimeAgo('en-US').format(new Date(t))
}

export const trimContent = (str: string): string => {
  const maxLength = 256
  let trimmedString = str.substr(0, maxLength)

  trimmedString = trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')),
  )

  return trimmedString.length === str.length
    ? trimmedString
    : `${trimmedString} ...`
}
