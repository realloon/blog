import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'

export const GET: APIRoute = async context => {
  const posts = await getCollection('blog')
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())

  return rss({
    title: "Realloon's blog",
    description: "Recent content on Realloon's blog",
    site: context.site!,
    trailingSlash: false,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `/post/${post.id}`,
      content: post.rendered!.html,
    })),
    customData: '<language>zh-CN</language>',
  })
}
