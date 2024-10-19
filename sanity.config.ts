import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './logickal-jrnl-content/schemaTypes'


export default defineConfig({
  name: 'default',
  title: 'Logickal Jrnl Content',

  projectId: 'zbrphau8',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
