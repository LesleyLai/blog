<?xml version="1.0" encoding="utf-8"?>
<!--
Modified from https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl
-->

<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <xsl:variable name="lang" select="/rss/channel/language"/>
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>
          <xsl:value-of select="/rss/channel/title"/>
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          :root {
            --bg-color: #f4f2ea;
            --link-color: #4183c4;
            --highlight-color: #0af;
          }

          body {
            padding: 20px;
            background-color: var(--bg-color);
            line-height: 1.5;
            max-width: 80ch;
            margin: auto;

            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          nav {
            background-color: #ddddff;
            padding: 20px;
            margin-bottom: 20px;
          }


          h2, h3 {
            margin: 1em 0 0.5em 0;
          }

        a {
            color: var(--link-color);
        }

        a:hover {
            color: var(--highlight-color);
        }

        p {
          margin: 10px 0;
        }

        small p {
          margin: 5px 0;
        }

        .rss-item {
          border-bottom: 1px solid #999;
          padding-bottom: 5px;
        }

        .tags {
          display: inline-flex;
          margin: 0;
          padding: 0;
          list-style: none;
          gap: 5px;
        }
        </style>
      </head>
      <body>
        <nav>
          <xsl:choose>
            <xsl:when test="$lang = 'zh-cn'">
              <p>
                <strong>这是一个网页信息源</strong>，也叫 RSS 订阅源。要<strong>订阅</strong>，请将地址栏中的链接复制到你的 RSS 阅读器中。
              </p>
            </xsl:when>
            <xsl:otherwise>
              <p>
                <strong>This is a web feed,</strong> also known as an RSS feed. <strong>Subscribe</strong> by copying the URL from the address bar into your newsreader.
              </p>
              <p>
                Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started with newsreaders and subscribing. It’s free.
              </p>
            </xsl:otherwise>
          </xsl:choose>
        </nav>
        <div>
          <header>
            <h1>
              <!-- https://commons.wikimedia.org/wiki/File:Feed-icon.svg -->
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="vertical-align: text-bottom; width: 1.2em; height: 1.2em;" class="pr-1" id="RSSicon" viewBox="0 0 256 256">
                <defs>
                  <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
                    <stop  offset="0.0" stop-color="#E3702D"/><stop  offset="0.1071" stop-color="#EA7D31"/>
                    <stop  offset="0.3503" stop-color="#F69537"/><stop  offset="0.5" stop-color="#FB9E3A"/>
                    <stop  offset="0.7016" stop-color="#EA7C31"/><stop  offset="0.8866" stop-color="#DE642B"/>
                    <stop  offset="1.0" stop-color="#D95B29"/>
                  </linearGradient>
                </defs>
                <rect width="256" height="256" rx="55" ry="55" x="0"  y="0"  fill="#CC5D15"/>
                <rect width="246" height="246" rx="50" ry="50" x="5"  y="5"  fill="#F49C52"/>
                <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)"/>
                <circle cx="68" cy="189" r="24" fill="#FFF"/>
                <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
                <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
              </svg>

              <xsl:choose>
                <xsl:when test="$lang = 'zh-cn'">
                  RSS订阅源预览
                </xsl:when>
                <xsl:otherwise>
                  Web Feed Preview
                </xsl:otherwise>
              </xsl:choose>
              
            </h1>
            <h2><xsl:value-of select="/rss/channel/title"/></h2>
            <p><xsl:value-of select="/rss/channel/description"/></p>
            <a target="_blank">
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>

              <xsl:choose>
                <xsl:when test="$lang = 'zh-cn'">
                  返回主页 &#x2192;
                </xsl:when>
                <xsl:otherwise>
                  Visit Website &#x2192;
                </xsl:otherwise>
              </xsl:choose>
            </a>
          </header>
          <h2>
            <xsl:choose>
              <xsl:when test="$lang = 'zh-cn'">
                最新内容
              </xsl:when>
              <xsl:otherwise>
                Recent Items
              </xsl:otherwise>
            </xsl:choose>
          </h2>
          <xsl:for-each select="/rss/channel/item">
            <div class="rss-item">
              <h3>
                <a target="_blank">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <p><xsl:value-of select="description"/></p>
              <small>
                <p>
                  <xsl:choose>
                    <xsl:when test="$lang = 'zh-cn'">
                      发表于：
                    </xsl:when>
                    <xsl:otherwise>
                      Published: 
                    </xsl:otherwise>
                  </xsl:choose>
                  <xsl:variable name="pubDate" select="pubDate"/>
                  <xsl:variable name="year" select="substring($pubDate, 13, 4)" />
                  <xsl:variable name="month" select="substring($pubDate, 9, 3)" />
                  <xsl:variable name="day" select="substring($pubDate, 6, 2)" />
                  <xsl:variable name="monthNum">
                    <xsl:choose>
                      <xsl:when test="$month='Jan'">01</xsl:when>
                      <xsl:when test="$month='Feb'">02</xsl:when>
                      <xsl:when test="$month='Mar'">03</xsl:when>
                      <xsl:when test="$month='Apr'">04</xsl:when>
                      <xsl:when test="$month='May'">05</xsl:when>
                      <xsl:when test="$month='Jun'">06</xsl:when>
                      <xsl:when test="$month='Jul'">07</xsl:when>
                      <xsl:when test="$month='Aug'">08</xsl:when>
                      <xsl:when test="$month='Sep'">09</xsl:when>
                      <xsl:when test="$month='Oct'">10</xsl:when>
                      <xsl:when test="$month='Nov'">11</xsl:when>
                      <xsl:when test="$month='Dec'">12</xsl:when>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:value-of select="concat($year, '-', $monthNum, '-', $day)" />
                </p>
                <p>
                  <xsl:choose>
                    <xsl:when test="$lang = 'zh-cn'">
                      标签：
                    </xsl:when>
                    <xsl:otherwise>
                      Tags: 
                    </xsl:otherwise>
                  </xsl:choose>
                  <ul class="tags">
                    <xsl:for-each select="category">
                      <li><xsl:value-of select="."/></li>
                    </xsl:for-each>
                  </ul>
                </p>
              </small>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
