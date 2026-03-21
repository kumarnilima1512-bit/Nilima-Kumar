import { Client } from '@notionhq/client'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const notion = new Client({ auth: config.notionToken })

  const response = await notion.databases.query({
    database_id: config.notionSkillsDb as string,
  })

  const skills = response.results.map((page: any) => {
    const props = page.properties
    return {
      id:       page.id,
      name:     props.Title?.title?.[0]?.plain_text ?? '',
      logo:     props.Logo?.url ?? '',
      color:    props.Color?.rich_text?.[0]?.plain_text ?? '#7c3aed',
      category: props.Category?.select?.name ?? 'Other',
    }
  })

  return skills
})