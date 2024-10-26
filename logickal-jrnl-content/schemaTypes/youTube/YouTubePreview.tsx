// ./src/schemas/schemaTypes/youTubeType/YouTubePreview.tsx

import type {PreviewProps} from 'sanity'
import {Flex, Text, ThemeProvider, studioTheme} from '@sanity/ui'
import React from 'react'
import YouTubePlayer from 'react-player/youtube'

export function YouTubePreview(props: PreviewProps) {
  const {title: url} = props || {}

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