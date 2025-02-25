const categories: Record<
  | 'Social Butterfly'
  | 'Famous Peacock'
  | 'Wise Owl'
  | 'Sleepy Sloth'
  | 'Busy Bee'
  | 'Curious Cat'
  | 'Social Spider',
  { trait: string; emoji: string }
> = {
  'Social Butterfly': {
    trait:
      "You're fluttering from conversation to conversation, pollinating discussions with your replies.",
    emoji: '🦋',
  },
  'Famous Peacock': {
    trait:
      'You love showcasing your own thoughts, strutting through threads with self-assured elegance.',
    emoji: '🦚',
  },
  'Wise Owl': {
    trait: "You're the one starting thoughtful discussions, sharing wisdom from your perch.",
    emoji: '🦉',
  },
  'Sleepy Sloth': {
    trait: 'Minimal movement through the social jungle, just hanging around occasionally.',
    emoji: '🦥',
  },
  'Busy Bee': {
    trait: 'Always working to connect the hive, buzzing between different conversations.',
    emoji: '🐝',
  },
  'Curious Cat': {
    trait: 'Poking your whiskers into every interesting conversation you find.',
    emoji: '🐱',
  },
  'Social Spider': {
    trait: 'Weaving complex webs of conversations, connecting multiple threads together.',
    emoji: '🕷️',
  },
}

const specialties: Record<
  'Artist' | 'Connector' | 'Explorer' | 'Dialogist' | 'Observer',
  { trait: string }
> = {
  Artist: {
    trait:
      'Your visual creativity shines through in every post, painting the digital canvas with images and videos.',
  },
  Connector: {
    trait:
      'You excel at bridging conversations across the platform, creating a web of interconnected discussions.',
  },
  Explorer: {
    trait:
      'Always venturing beyond, bringing external knowledge and resources to enrich conversations.',
  },
  Dialogist: {
    trait: 'Your strength lies in weaving words into thoughtful discussions.',
  },
  Observer: {
    trait:
      'You prefer to watch and learn from the sidelines, taking in the wisdom of others in silence.',
  },
}

export function determineCategory(args: {
  nbPostStared: number
  nbPostRepliesToAStartedOne: number
  nbPostRepliesToOthers: number
  kindOfEmbed: {
    kind: string
    count: number
  }[]
  altPercentage: number
}): { title: string; traits: string; emoji: string } {
  const {
    nbPostStared,
    nbPostRepliesToAStartedOne,
    nbPostRepliesToOthers,
    kindOfEmbed,
    altPercentage,
  } = args

  const totalReplies = nbPostRepliesToAStartedOne + nbPostRepliesToOthers
  const totalInteractions = nbPostStared + totalReplies
  const totalTotal = totalReplies + totalInteractions

  const nbPostStaredRatio = nbPostStared / totalInteractions
  const nbPostRepliesToAStartedOneRatio = nbPostRepliesToAStartedOne / totalInteractions
  const nbPostRepliesToOthersRatio = nbPostRepliesToOthers / totalInteractions

  let linkInside = 0
  let linkOutside = 0
  let art = 0

  for (const embed of kindOfEmbed) {
    if (embed.kind.toLowerCase().includes('link to other post')) {
      linkInside += embed.count
    } else if (embed.kind.toLowerCase().includes('link to outside')) {
      linkOutside += embed.count
    } else if (
      embed.kind.toLowerCase().includes('image') ||
      embed.kind.toLowerCase().includes('video')
    ) {
      art += embed.count
    }
  }

  const artRatio = art / totalTotal
  const linkInsideRatio = linkInside / totalTotal
  const linkOutsideRatio = linkOutside / totalTotal

  // console.log(`artRatio`, artRatio)
  // console.log(`linkInsideRatio`, linkInsideRatio)
  // console.log(`linkOutsideRatio`, linkOutsideRatio)

  let animalBase: keyof typeof categories
  if (totalInteractions < 10) {
    animalBase = 'Sleepy Sloth'
  } else if (
    nbPostRepliesToAStartedOneRatio > 0.4 &&
    nbPostRepliesToAStartedOneRatio > nbPostRepliesToOthersRatio
  ) {
    animalBase = 'Famous Peacock'
  } else if (nbPostRepliesToOthersRatio > 0.5 && nbPostStaredRatio < 0.2) {
    animalBase = 'Social Butterfly'
  } else if (nbPostStaredRatio > 0.4 && nbPostStared > totalReplies * 0.8) {
    animalBase = 'Wise Owl'
  } else if (nbPostRepliesToOthersRatio > 0.5 && nbPostStaredRatio < 0.5) {
    animalBase = 'Curious Cat'
  } else if (nbPostRepliesToOthersRatio > 0.4 && nbPostStaredRatio > 0.3) {
    animalBase = 'Busy Bee'
  } else {
    animalBase = 'Social Spider'
  }

  // Then determine specialty
  let specialty: keyof typeof specialties
  if (totalInteractions < 6) {
    specialty = 'Observer'
  } else if (linkOutsideRatio > 0.05) {
    specialty = 'Explorer'
  } else if (linkInsideRatio > 0.03) {
    specialty = 'Connector'
  } else if (artRatio > 0.03) {
    specialty = 'Artist'
  } else {
    specialty = 'Dialogist'
  }

  // Combine title and traits
  const title = `${altPercentage === 100 ? 'Epic' : 'The'} ${animalBase} ${specialty}`
  const traits = `${categories[animalBase].trait} ${specialties[specialty].trait}`

  return {
    title,
    traits,
    emoji: categories[animalBase].emoji,
  }
}
