import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import DiscComing from '#RP/disc-coming/DiscComing'
import DiscGroups from '#RP/disc-groups/DiscGroups'
import DiscGroupAdd from '#RP/disc-group-add/DiscGroupAdd'
import DiscGroupDetail from '#RP/disc-group-detail/DiscGroupDetail'
import DiscGroupViewList from '#RP/disc-group-view-list/DiscGroupViewList'
import DiscGroupEditList from '#RP/disc-group-edit-list/DiscGroupEditList'
import DiscAdd from '#RP/disc-add/DiscAdd'
import DiscSearch from '#RP/disc-search/DiscSearch'
import DiscDetailOfId from '#RP/disc-detail/DiscDetailOfId'
import DiscDetailOfAsin from '#RP/disc-detail/DiscDetailOfAsin'
import Users from '#RP/users/Users'
import UserAdd from '#RP/user-add/UserAdd'
import UserDetail from '#RP/user-detail/UserDetail'
import Console from '#RP/console/Console'
import NotFound from '#RP/notfound/NotFound'

import { linkToComing, linkToDiscs, linkToGroups, linkToMsgs, linkToUsers } from '#RU/links'

const LazyDiscRecords = lazy(
  () => import(/* webpackChunkName: "disc_records" */ '#RP/disc-records/DiscRecords')
)

export const routes = (
  <Suspense fallback={<Spin delay={200} />}>
    <Routes>
      <Route path="/" element={<Navigate to="/disc_groups" />} />

      <Route path={linkToGroups()} element={<DiscGroups />} />
      <Route path={linkToGroups(`/add`)} element={<DiscGroupAdd />} />
      <Route path={linkToGroups(`/:key`)} element={<DiscGroupDetail />} />
      <Route path={linkToGroups(`/:key/discs`)} element={<DiscGroupViewList />} />
      <Route path={linkToGroups(`/:key/discs/edit`)} element={<DiscGroupEditList />} />
      <Route path={linkToComing()} element={<DiscComing />} />
      <Route path={linkToDiscs(`/:id`)} element={<DiscDetailOfId />} />
      <Route path={linkToDiscs(`/asin/:asin`)} element={<DiscDetailOfAsin />} />
      <Route path={linkToDiscs(`/add`)} element={<DiscAdd />} />
      <Route path={linkToDiscs(`/search`)} element={<DiscSearch />} />
      <Route path={linkToDiscs(`/:id/records`)} element={<LazyDiscRecords />} />
      <Route path={linkToUsers()} element={<Users />} />
      <Route path={linkToUsers(`/add`)} element={<UserAdd />} />
      <Route path={linkToUsers(`/:id`)} element={<UserDetail />} />
      <Route path={linkToMsgs()} element={<Console />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)
