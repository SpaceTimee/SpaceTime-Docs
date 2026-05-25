import projects from './projects.json'

export const config = { runtime: 'edge' }

export default function (request: Request) {
  const url = new URL(request.url)
  const lower = url.pathname.toLowerCase()

  if (url.pathname !== lower) {
    url.pathname = lower
    return Response.redirect(url.toString(), 308)
  }

  const [project] = url.pathname.split('/').filter(Boolean)

  url.pathname = projects.includes(project) ? `/${project}/` : '/'
  return Response.redirect(url.toString(), 307)
}
