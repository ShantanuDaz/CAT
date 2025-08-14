// Mock data for exam prep app
export const mockTopics = [
  {
    id: '1',
    user_id: 'user123',
    name: 'Mathematics',
    parent_id: null,
    order_index: 1,
    slug: 'mathematics',
    description: 'Core mathematics topics for exam preparation'
  },
  {
    id: '2',
    user_id: 'user123',
    name: 'Algebra',
    parent_id: '1',
    order_index: 1,
    slug: 'algebra',
    description: 'Algebraic concepts and equations'
  },
  {
    id: '3',
    user_id: 'user123',
    name: 'Geometry',
    parent_id: '1',
    order_index: 2,
    slug: 'geometry',
    description: 'Shapes, angles, and spatial relationships'
  },
  {
    id: '4',
    user_id: 'user123',
    name: 'Linear Equations',
    parent_id: '2',
    order_index: 1,
    slug: 'linear-equations',
    description: 'Solving linear equations and systems'
  },
  {
    id: '5',
    user_id: 'user123',
    name: 'Quadratic Equations',
    parent_id: '2',
    order_index: 2,
    slug: 'quadratic-equations',
    description: 'Quadratic formulas and solutions'
  },
  {
    id: '6',
    user_id: 'user123',
    name: 'Single Variable',
    parent_id: '4',
    order_index: 1,
    slug: 'single-variable',
    description: 'Linear equations with one variable'
  },
  {
    id: '7',
    user_id: 'user123',
    name: 'Multiple Variables',
    parent_id: '4',
    order_index: 2,
    slug: 'multiple-variables',
    description: 'Systems of linear equations'
  },
  {
    id: '8',
    user_id: 'user123',
    name: 'Triangles',
    parent_id: '3',
    order_index: 1,
    slug: 'triangles',
    description: 'Properties and types of triangles'
  },
  {
    id: '9',
    user_id: 'user123',
    name: 'Science',
    parent_id: null,
    order_index: 2,
    slug: 'science',
    description: 'Core science topics for exam preparation'
  },
  {
    id: '10',
    user_id: 'user123',
    name: 'Physics',
    parent_id: '9',
    order_index: 1,
    slug: 'physics',
    description: 'Laws of motion, energy, and matter'
  },
  {
    id: '11',
    user_id: 'user123',
    name: 'Chemistry',
    parent_id: '9',
    order_index: 2,
    slug: 'chemistry',
    description: 'Elements, compounds, and reactions'
  },
  {
    id: '12',
    user_id: 'user123',
    name: 'Mechanics',
    parent_id: '10',
    order_index: 1,
    slug: 'mechanics',
    description: 'Motion, force, and energy'
  },
  {
    id: '13',
    user_id: 'user123',
    name: 'Thermodynamics',
    parent_id: '10',
    order_index: 2,
    slug: 'thermodynamics',
    description: 'Heat, temperature, and energy transfer'
  },
  {
    id: '14',
    user_id: 'user123',
    name: 'Organic Chemistry',
    parent_id: '11',
    order_index: 1,
    slug: 'organic-chemistry',
    description: 'Carbon-based compounds and reactions'
  },
  {
    id: '15',
    user_id: 'user123',
    name: 'Inorganic Chemistry',
    parent_id: '11',
    order_index: 2,
    slug: 'inorganic-chemistry',
    description: 'Non-carbon elements and compounds'
  }
]



// Helper functions to work with the mock data
export const getTopicsByUserId = (userId) => {
  return mockTopics.filter(topic => topic.user_id === userId)
}

export const getTopicsByParentId = (parentId, userId) => {
  return mockTopics.filter(topic => 
    topic.parent_id === parentId && topic.user_id === userId
  ).sort((a, b) => a.order_index - b.order_index)
}



export const getRootTopics = (userId) => {
  return mockTopics.filter(topic => 
    topic.parent_id === null && topic.user_id === userId
  ).sort((a, b) => a.order_index - b.order_index)
}