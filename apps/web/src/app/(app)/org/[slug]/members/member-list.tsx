import { organizationSchema } from '@saas/auth'
import { ArrowLeftRightIcon, CrownIcon, UserMinus2Icon } from 'lucide-react'

import { ability, getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'

import { removeMemberAction } from './actions'
import { UpdateMemberRoleSelect } from './update-member-role-select'

export async function MemberList() {
  const org = getCurrentOrg()
  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(org!),
    getMembers(org!),
    getOrganization(org!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    <AvatarFallback />
                    {member.avatarUrl && (
                      <AvatarImage
                        src={member.avatarUrl}
                        className="aspect-square size-full"
                        width={32}
                        height={32}
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 font-medium">
                      {member.name}
                      {member.userId === membership.userId && (
                        <span className="text-xs text-muted-foreground">
                          (me)
                        </span>
                      )}
                      {member.userId === organization.ownerId && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <CrownIcon className="size-3" />
                          (Owner)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can(
                      'transfer_ownership',
                      authOrganization,
                    ) && (
                      <Button size="sm" variant="ghost">
                        <ArrowLeftRightIcon className="mr-2 size-4" />
                        Transfer ownership
                      </Button>
                    )}

                    {permissions?.can('update', 'User') && (
                      <UpdateMemberRoleSelect
                        memberId={member.id}
                        value={member.role}
                        disabled={
                          member.userId === membership.userId ||
                          member.userId === organization.ownerId
                        }
                      />
                    )}

                    {permissions?.can('delete', 'User') && (
                      <form action={removeMemberAction.bind(null, member.id)}>
                        <Button
                          disabled={
                            member.userId === membership.userId ||
                            member.userId === organization.ownerId
                          }
                          size="sm"
                          type="submit"
                          variant="destructive"
                        >
                          <UserMinus2Icon className="mr-2 size-4" />
                          Remove
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
