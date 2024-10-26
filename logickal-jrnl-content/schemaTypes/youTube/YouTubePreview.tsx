// ./src/schemas/schemaTypes/youTubeType/YouTubePreview.tsx

import type {PreviewProps} from 'sanity'
import {Flex, Text, ThemeProvider, studioTheme} from '@sanity/ui'
import React from 'react'
import YouTubePlayer from 'react-player/youtube'

export function YouTubePreview(props: PreviewProps) {
  console.log('Props: ', props)
  const {title: url} = props || {}

  console.log('URL: ', url);

  return (
    <ThemeProvider theme={studioTheme}>
      <Flex padding={3} align="center" justify="center">
        {typeof url === 'string' && url ? (
          <YouTubePlayer url={url} />
        ) : (
          <Text>Add a YouTube URL</Text>
        )}
      </Flex>
    </ThemeProvider>
  )
}