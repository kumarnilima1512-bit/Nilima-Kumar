import { Client } from '@notionhq/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const notion = new Client({ auth: config.notionToken })

  const response = await notion.databases.query({
    database_id: config.notionCertificationsDb as string,
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  const certifications = response.results.map((page: any) => {
    const props = page.properties
    return {
      id:     page.id,
      title:  props.Title?.title?.[0]?.plain_text ?? '',
      issuer: props.Issuer?.rich_text?.[0]?.plain_text ?? '',
      date:   props.Date?.date?.start ?? '',
      link:   props.Link?.url ?? '',
      image:  props.Image?.files?.[0]?.file?.url ?? props.Image?.files?.[0]?.external?.url ?? '',
    }
  })

  return certifications
})