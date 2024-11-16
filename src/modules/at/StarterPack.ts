import { Entity, Fields, Filter, Relations } from 'remult'
import { sqlRelations, sqlRelationsFilter } from 'remult/internals'

import { Roles } from '$modules/auth/Roles'

import { BSkyty } from './BSkyty'
import { ListItem } from './ListItem'

@Entity<StarterPack>('starter-packs', {
  allowApiRead: true,
  allowApiCrud: Roles.admin,
  defaultOrderBy: {
    updatedAt: 'desc',
  },
})
export class StarterPack {
  @Fields.string({ caption: 'id / uri' })
  id!: string

  @Fields.string({ includeInApi: Roles.admin })
  listUri!: string

  @Fields.string()
  creatorDid!: string

  @Relations.toOne<StarterPack, BSkyty>(() => BSkyty, { fields: { id: 'creatorDid' } })
  creator!: BSkyty

  @Fields.string()
  name!: string

  @Fields.date({ includeInApi: Roles.admin })
  createdAt!: Date

  @Fields.date({ includeInApi: Roles.admin })
  updatedAt!: Date

  @Fields.string()
  description!: string

  @Relations.toMany<StarterPack, ListItem>(() => ListItem, { fields: { listUri: 'listUri' } })
  items!: ListItem[]

  @Fields.number({
    sqlExpression() {
      return sqlRelations(StarterPack).items.$count()
    },
  })
  nbMembers!: number

  static filterByCreator = Filter.createCustom<StarterPack, { str: string }>(
    // REMULT ?
    // @ts-ignore
    async ({ str }) => {
      return sqlRelationsFilter(StarterPack).creator.some({
        $or: [
          { displayName: { $contains: str } },
          { handle: { $contains: str } },
          { id: { $contains: str } },
        ],
      })
    },
  )
}
