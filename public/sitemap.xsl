<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Platina.uz — sitemap</title>
        <style>
          :root {
            --ink: #11131f; --ink-2: #5c6480; --paper: #f6f7fa;
            --surface: #fff; --rule: #d8dce8; --accent: #0057b0;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --ink: #edeff6; --ink-2: #99a1bb; --paper: #0c0e18;
              --surface: #141726; --rule: #2a2f45; --accent: #6ba8f0;
            }
          }
          body {
            margin: 0; background: var(--paper); color: var(--ink);
            font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
          }
          .wrap { max-width: 70rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
          h1 { font-size: 1.5rem; margin: 0 0 .35rem; letter-spacing: -.01em; }
          .sub { color: var(--ink-2); margin: 0 0 1.5rem; }
          .count { font-variant-numeric: tabular-nums; font-weight: 600; }
          table {
            width: 100%; border-collapse: collapse; background: var(--surface);
            border: 1px solid var(--rule); border-radius: 4px; overflow: hidden;
          }
          th, td {
            text-align: left; padding: .55rem .8rem;
            border-bottom: 1px solid var(--rule); vertical-align: top;
          }
          th {
            font-size: .7rem; text-transform: uppercase; letter-spacing: .08em;
            color: var(--ink-2); font-weight: 600;
          }
          tr:last-child td { border-bottom: 0; }
          td.n { color: var(--ink-2); font-variant-numeric: tabular-nums; width: 3.5rem; }
          a { color: var(--accent); text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .meta { color: var(--ink-2); white-space: nowrap; font-variant-numeric: tabular-nums; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <xsl:apply-templates/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Sitemap index -->
  <xsl:template match="sm:sitemapindex">
    <h1>Sitemap index</h1>
    <p class="sub">
      <span class="count"><xsl:value-of select="count(sm:sitemap)"/></span>
      child sitemaps. Each one lists its own URLs — open them to see the pages.
    </p>
    <table>
      <tr><th>#</th><th>Sitemap</th><th>Last modified</th></tr>
      <xsl:for-each select="sm:sitemap">
        <tr>
          <td class="n"><xsl:value-of select="position()"/></td>
          <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
          <td class="meta"><xsl:value-of select="substring(sm:lastmod, 1, 10)"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <!-- Any urlset: plain, news, or article chunk -->
  <xsl:template match="sm:urlset">
    <h1>Sitemap</h1>
    <p class="sub">
      <span class="count"><xsl:value-of select="count(sm:url)"/></span>
      URLs in this file.
    </p>
    <table>
      <tr><th>#</th><th>URL</th><th>Date</th></tr>
      <xsl:for-each select="sm:url">
        <tr>
          <td class="n"><xsl:value-of select="position()"/></td>
          <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
          <td class="meta">
            <xsl:choose>
              <xsl:when test="sm:lastmod">
                <xsl:value-of select="substring(sm:lastmod, 1, 10)"/>
              </xsl:when>
              <xsl:when test="news:news/news:publication_date">
                <xsl:value-of
                  select="substring(news:news/news:publication_date, 1, 10)"/>
              </xsl:when>
              <xsl:otherwise><xsl:value-of select="sm:changefreq"/></xsl:otherwise>
            </xsl:choose>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

</xsl:stylesheet>
