import {AbstractRestService} from "./abstract-rest-service";
import {PathListKey} from "../data/path-list-key";
import {PathListEntry} from "../data/path-list-entry";
import {ActivityDatabase} from "../database/activity-database";

export class ActivityRestService extends AbstractRestService {

    constructor(app, private database: ActivityDatabase) {
        super(app, database);
    }

    protected initList() {
        super.initList();

        const service = this;
        this._app.get("/services/friend/:friendKey/activity", async (req, res) => {
            const rows = await service.database.list();
            const friendKey = req.params.friendKey;
            const result = [];
            for (const activity of rows) {
                if (activity.friends) {
                    for (const friend of activity.friends) {
                        if (friend === friendKey) {
                            result.push(activity);
                            break;
                        }
                    }
                }
            }
            return service.database.createPathList(result, res);
        });

        this._app.get("/services/location/:locationKey/activity", async (req, res) => {
            const rows = await service.database.list();
            const locationKey = req.params.locationKey;
            const result = [];
            for (const activity of rows) {
                if (activity.location === locationKey) {
                    result.push(activity);
                    break;
                }
            }
            return service.database.createPathList(result, res);
        });

    }

    protected initRead() {
        super.initRead();

        const service = this;
        this._app.get("/services/friend/:friendKey/activity/:activityKey", async (req, res) => {
            // nop
            res.json("true");
        });
    }

    protected initCreate() {
        super.initCreate();

        const service = this;
        this._app.post("/services/friend/:friendKey/activity", async (req, res) => {
            const friendKey = req.params.friendKey;
            const activityKey = req.body.activity;
            console.log("post");
            console.log(friendKey);
            console.log(activityKey);
            const activity = await service.database.read(activityKey);
            if (!activity.friends) {
                activity.friends = [];
            }
            activity.friends.push(friendKey);
            activity.friends = Array.from(new Set(activity.friends)); // unique
            await service.database.update(activity._id, activity);
            res.json("true");
        });
    }

    protected initUpdate() {
        super.initUpdate();

        const service = this;
        this._app.put("/services/friend/:friendKey/activity", async (req, res) => {
            const friendKey = req.params.friendKey;
            const activityKey = req.body.activity;
            const activity = await service.database.read(activityKey);
            if (!activity.friends) {
                activity.friends = [];
            }
            activity.friends.push(friendKey);
            activity.friends = Array.from(new Set(activity.friends)); // unique
            await service.database.update(activity._id, activity);
            res.json("true");
        });
    }

    protected initDelete() {
        super.initDelete();

        const service = this;
        this._app.delete("/services/friend/:friendKey/activity/:activityKey", async (req, res) => {
            const friendKey = req.params.friendKey;
            const activityKey = req.params.activityKey;
            const activity = await service.database.read(activityKey);
            if (!activity.friends) {
                activity.friends = [];
            }
            activity.friends.pop(friendKey);
            activity.friends = Array.from(new Set(activity.friends)); // unique
            const result = await service.database.update(activity._id, activity);
            res.json("true");
        });
    }

}