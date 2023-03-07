window.Wsfly = window.Wsfly || {};

/*===========================================
 =浏览器数据库操作
 =作者：Wsfly.com
 =版本：V1.0
 =参数说明：
 ===========================================*/
function WsflyDB(storeName) {
    this.IsSupport = false;
    this.StoreName = storeName ? storeName : "Wsfly_IndexedDB";
    this.DB = null;

    this.Init = function () {
        //是否支持
        this.CheckSupport();
        if (!this.IsSupport) return;

        //打开数据库
        this.OpenDB(function (dbResult) { });
    };
    this.CheckSupport = function () {
        //是否支持indexedDB
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!window.indexedDB) {
            this.PrintLog("你的浏览器不支持IndexedDB");
            this.IsSupport = false;
        }
        this.IsSupport = true;
    };
    this.OpenDB = function (fn_Callback) {
        //打开数据库
        if (!this.IsSupport) return null;

        if (this.DB != null) {
            fn_Callback(this.DB);
            return;
        }
        
        var request = window.indexedDB.open(this.StoreName, 2);
        var db = null;
        var $this = this;
        request.onerror = function (event) {
            //打开数据库失败
            $this.PrintLog("打开IndexedDB失败");
            fn_Callback(null);
        };
        request.onupgradeneeded = function (event) {
            //初始或有新版本
            $this.PrintLog("Upgrading");
            db = event.target.result;
            db.createObjectStore($this.StoreName, { keyPath: "key" });
            fn_Callback(db);
        };
        request.onsuccess = function (event) {
            //成功打开数据库
            db = event.target.result;
            fn_Callback(db);
        };

        this.DB = db;
    };
    this.GetObjectStore = function (fn_Callback) {
        //打开数据库
        var $this = this;
        this.OpenDB(function (db) {
            //没有得到数据库
            if (db == null) return null;
            //创建事务
            var transaction = db.transaction([$this.StoreName], "readwrite");
            transaction.oncomplete = function (event) {
                //$this.PrintLog("创建事务成功");
                return true;
            };
            transaction.onerror = function (event) {
                //$this.PrintLog("创建事务错误");
                return false;
            };
            //获取ObjectStore
            var objectStore = transaction.objectStore($this.StoreName);
            //回调
            fn_Callback(objectStore);
        });
    };
    this.Query = function (key, fn_Callback) {
        //查询
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            var request = objectStore.get(key);
            request.onsuccess = function (event) {
                //回调
                fn_Callback(request.result, event);
            };
        });
    };
    this.Insert = function (jsonData) {
        //添加对象
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            if (jsonData != null) {
                objectStore.add(jsonData);
            }
        });
    };
    this.InsertArray = function (jsonDataArray) {
        //添加对象列表
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            if (jsonDataArray != null && jsonDataArray.length > 0) {
                for (var i = 0; i < jsonDataArray.length; i++) {
                    objectStore.add(jsonDataArray[i]);
                }
            }
        });
    };
    this.Update = function (key, jsonData) {
        //修改
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            var request = objectStore.get(key);
            request.onsuccess = function (event) {
                objectStore.put(jsonData);
            };
        });
    };
    this.UpdateValue = function (key, name, value) {
        //修改值
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            var request = objectStore.get(key);
            request.onsuccess = function (event) {
                var result = request.result;
                result[name] = value;
                objectStore.put(result);
            };
        });
    };
    this.Delete = function (key) {
        //删除
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            objectStore.delete(key);
        });
    };
    this.Clear = function () {
        //清除实例
        this.GetObjectStore(function (objectStore) {
            if (objectStore == null) return;
            objectStore.clear();
        });
    };
    this.Drop = function () {
        //删除实例
        var $this = this;
        this.OpenDB(function (db) {
            if (db.objectStoreNames.contains($this.StoreName)) {
                db.deleteObjectStore($this.StoreName);
            }
            $this.DB = null;
        })
    };
    this.PrintLog = function (msg) {
        //输出日志
        console.log(msg);
    };

    //初始化
    this.Init();
};