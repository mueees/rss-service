'use strict';

let WorkerHive = require('./index');
let expect = require('chai').expect;

class DefaultWorker {
    execute(data) {
    }
}

describe('WorkerHive', function () {
    it('should be defined', function () {
        expect(WorkerHive).to.be.ok;
    });

    it('should not allow initialize without worker', function () {
        let err;

        try {
            new WorkerHive({});
        } catch (e) {
            err = e;
        }

        expect(err).to.be.an('error');
    });

    it('should initialize hive instance', function () {
        let workerHive = new WorkerHive({
            worker: DefaultWorker
        });

        expect(workerHive).to.be.ok;
    });

    it('should has execute method', function () {
        let workerHive = new WorkerHive({
            worker: DefaultWorker
        });

        expect(workerHive.execute).to.be.ok;
    });

    it('should return promise for execute method', function () {
        let workerHive = new WorkerHive({
            worker: DefaultWorker
        });

        let executeResult = workerHive.execute();

        expect(executeResult).to.be.ok;
        expect(executeResult.then).to.be.ok;
        expect(executeResult.catch).to.be.ok;
    });

    it('should has hasFreeWorker method', function () {
        let workerHive = new WorkerHive({
            worker: DefaultWorker
        });

        expect(workerHive.hasFreeWorker).to.be.ok;
    });
});