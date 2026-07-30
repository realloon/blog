import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'

export const GET: APIRoute = async context => {
  const posts = await getCollection('blog')
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())

  return rss({
    title: "Vortex's blog",
    description: "Recent content on Vortex's blog",
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `/post/${post.id}/`,
      content: post.rendered!.html,
    })),
    customData: '<language>zh-CN</language>',
  })
}
