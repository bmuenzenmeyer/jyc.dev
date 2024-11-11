import { Entity, Fields, Relations } from 'remult'
import { sqlRelations } from 'remult/internals'

import { Roles } from '$modules/auth/Roles'
import { LogHandleStats } from '$modules/logs/LogHandleStats'

import { BSkyty } from './BSkyty'
import { ListItem } from './ListItem'

@Entity<StarterPack>('starter-packs', {
  allowApiRead: true,
  allowApiCrud: Roles.admin,
  // defaultOrderBy: {
  //   firstTimeHere: 'desc',
  // },
})
export class StarterPack {
  @Fields.string({ caption: 'id / uri' })
  id!: string

  @Fields.string()
  listUri!: string

  @Fields.string()
  creatorDid!: string

  @Relations.toOne<StarterPack, BSkyty>(() => BSkyty, { fields: { id: 'creatorDid' } })
  creator!: BSkyty

  @Fields.string()
  name!: string

  @Fields.date()
  createdAt!: Date

  @Fields.date()
  updatedAt!: Date

  @Fields.string()
  description!: string

  @Relations.toMany<StarterPack, ListItem>(() => ListItem, { fields: { listUri: 'listUri' } })
  items!: ListItem[]

  @Fields.number({
    sqlExpression(entity) {
      return sqlRelations(StarterPack).items.$count()
    },
  })
  nbMembers!: number
}
