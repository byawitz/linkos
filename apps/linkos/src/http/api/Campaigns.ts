import {type Context} from "hono";
import API from "../../services/API.ts";
import Link, {type MaybeLink} from "../../models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";
import P from "@/providers/Providers.ts";
import type CampaignModel from "@@/db/CampaignModel.ts";
import Links from "@/http/api/Links.ts";
import BaseResource from "@/http/api/Base/BaseResource.ts";

export default class Campaigns extends BaseResource {
    protected static TABLE = 'campaigns';
}