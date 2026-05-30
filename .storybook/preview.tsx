import type { Preview } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // Pages and NavBar need a router; all other stories are self-contained.
      const needsRouter = context.parameters['withRouter'] === true
      return needsRouter ? (
        <MemoryRouter initialEntries={['/exercise1']}>
          <Story />
        </MemoryRouter>
      ) : (
        <Story />
      )
    },
  ],

  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'white', value: '#ffffff' },
      ],
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
}

export default preview
