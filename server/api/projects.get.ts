import { Client } from '@notionhq/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const notion = new Client({ auth: config.notionToken })

  const response = await notion.databases.query({
    database_id: config.notionProjectsDb as string,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  })

  const projects = response.results.map((page: any) => {
    const props = page.properties
    return {
      id:          page.id,
      title:       props.Title?.title?.[0]?.plain_text ?? '',
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
      tags:        props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      demo:        props.Demo?.url ?? '',
      github:      props.GitHub?.url ?? '',
      image:       props.Image?.files?.[0]?.file?.url ?? props.Image?.files?.[0]?.external?.url ?? '',
    }
  })

  return projects
})