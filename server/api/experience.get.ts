import { Client } from '@notionhq/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const notion = new Client({ auth: config.notionToken })

  const response = await notion.databases.query({
    database_id: config.notionExperienceDb as string,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  })

  const experiences = response.results.map((page: any) => {
    const props = page.properties
    const pointsRaw = props.Points?.rich_text?.[0]?.plain_text ?? ''
    return {
      id:       page.id,
      role:     props.Title?.title?.[0]?.plain_text ?? '',
      company:  props.Company?.rich_text?.[0]?.plain_text ?? '',
      period:   props.Period?.rich_text?.[0]?.plain_text ?? '',
      location: props.Location?.rich_text?.[0]?.plain_text ?? '',
      type:     props.Type?.select?.name ?? '',
      points:   pointsRaw.split('|').map((p: string) => p.trim()).filter(Boolean),
      tags:     props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
    }
  })

  return experiences
})