var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { observable, computed, action, autorun } from 'mobx';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TREE_EVENTS } from '../constants/events';
import * as _ from 'lodash';
var first = _.first, last = _.last, compact = _.compact, find = _.find, includes = _.includes, remove = _.remove, indexOf = _.indexOf, pullAt = _.pullAt, isString = _.isString, isFunction = _.isFunction;
var TreeModel = (function () {
    function TreeModel() {
        this.options = new TreeOptions();
        this.eventNames = Object.keys(TREE_EVENTS);
        this.expandedNodeIds = {};
        this.activeNodeIds = {};
        this.hiddenNodeIds = {};
        this.focusedNodeId = null;
        this.firstUpdate = true;
    }
    // events
    TreeModel.prototype.fireEvent = function (event) {
        event.treeModel = this;
        this.events[event.eventName].emit(event);
        this.events.event.emit(event);
    };
    TreeModel.prototype.subscribe = function (eventName, fn) {
        this.events[eventName].subscribe(fn);
    };
    // getters
    TreeModel.prototype.getFocusedNode = function () {
        return this.focusedNode;
    };
    TreeModel.prototype.getActiveNode = function () {
        return this.activeNodes[0];
    };
    TreeModel.prototype.getActiveNodes = function () {
        return this.activeNodes;
    };
    TreeModel.prototype.getVisibleRoots = function () {
        return this.virtualRoot.visibleChildren;
    };
    TreeModel.prototype.getFirstRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return first(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    TreeModel.prototype.getLastRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return last(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    Object.defineProperty(TreeModel.prototype, "isFocused", {
        get: function () {
            return TreeModel.focusedTree === this;
        },
        enumerable: true,
        configurable: true
    });
    TreeModel.prototype.isNodeFocused = function (node) {
        return this.focusedNode === node;
    };
    TreeModel.prototype.isEmptyTree = function () {
        return this.roots && this.roots.length === 0;
    };
    Object.defineProperty(TreeModel.prototype, "focusedNode", {
        get: function () {
            return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "expandedNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.expandedNodeIds)
                .filter(function (id) { return _this.expandedNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "activeNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.activeNodeIds)
                .filter(function (id) { return _this.activeNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    // locating nodes
    TreeModel.prototype.getNodeByPath = function (path, startNode) {
        if (startNode === void 0) { startNode = null; }
        if (!path)
            return null;
        startNode = startNode || this.virtualRoot;
        if (path.length === 0)
            return startNode;
        if (!startNode.children)
            return null;
        var childId = path.shift();
        var childNode = find(startNode.children, { id: childId });
        if (!childNode)
            return null;
        return this.getNodeByPath(path, childNode);
    };
    TreeModel.prototype.getNodeById = function (id) {
        var idStr = id.toString();
        return this.getNodeBy(function (node) { return node.id.toString() === idStr; });
    };
    TreeModel.prototype.getNodeBy = function (predicate, startNode) {
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (!startNode.children)
            return null;
        var found = find(startNode.children, predicate);
        if (found) {
            return found;
        }
        else {
            for (var _i = 0, _a = startNode.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var foundInChildren = this.getNodeBy(predicate, child);
                if (foundInChildren)
                    return foundInChildren;
            }
        }
    };
    TreeModel.prototype.isExpanded = function (node) {
        return this.expandedNodeIds[node.id];
    };
    TreeModel.prototype.isHidden = function (node) {
        return this.hiddenNodeIds[node.id];
    };
    TreeModel.prototype.isActive = function (node) {
        return this.activeNodeIds[node.id];
    };
    // actions
    TreeModel.prototype.setData = function (_a) {
        var nodes = _a.nodes, _b = _a.options, options = _b === void 0 ? null : _b, _c = _a.events, events = _c === void 0 ? null : _c;
        if (options) {
            this.options = new TreeOptions(options);
        }
        if (events) {
            this.events = events;
        }
        if (nodes) {
            this.nodes = nodes;
        }
        this.update();
    };
    TreeModel.prototype.update = function () {
        // Rebuild tree:
        var virtualRootConfig = (_a = {
                virtual: true
            },
            _a[this.options.childrenField] = this.nodes,
            _a);
        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0);
        this.roots = this.virtualRoot.children;
        // Fire event:
        if (this.firstUpdate) {
            if (this.roots) {
                this.firstUpdate = false;
                this._calculateExpandedNodes();
            }
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.updateData });
        }
        var _a;
    };
    TreeModel.prototype.setFocusedNode = function (node) {
        this.focusedNodeId = node ? node.id : null;
    };
    TreeModel.prototype.setFocus = function (value) {
        TreeModel.focusedTree = value ? this : null;
    };
    TreeModel.prototype.doForAll = function (fn) {
        this.roots.forEach(function (root) { return root.doForAll(fn); });
    };
    TreeModel.prototype.focusNextNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusPreviousNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusDrillDown = function () {
        var previousNode = this.getFocusedNode();
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.focusDrillUp = function () {
        var previousNode = this.getFocusedNode();
        if (!previousNode)
            return;
        if (previousNode.isExpanded) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode.realParent;
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.setActiveNode = function (node, value, multi) {
        if (multi === void 0) { multi = false; }
        if (multi) {
            this._setActiveNodeMulti(node, value);
        }
        else {
            this._setActiveNodeSingle(node, value);
        }
        if (value) {
            node.focus();
            this.fireEvent({ eventName: TREE_EVENTS.activate, node: node });
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: node });
        }
    };
    TreeModel.prototype.setExpandedNode = function (node, value) {
        this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[node.id] = value, _a));
        this.fireEvent({ eventName: TREE_EVENTS.toggleExpanded, node: node, isExpanded: value });
        var _a;
    };
    TreeModel.prototype.expandAll = function () {
        this.roots.forEach(function (root) { return root.expandAll(); });
    };
    TreeModel.prototype.collapseAll = function () {
        this.roots.forEach(function (root) { return root.collapseAll(); });
    };
    TreeModel.prototype.setIsHidden = function (node, value) {
        this.hiddenNodeIds = Object.assign({}, this.hiddenNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    TreeModel.prototype.setHiddenNodeIds = function (nodeIds) {
        this.hiddenNodeIds = nodeIds.reduce(function (id, hiddenNodeIds) {
            return Object.assign(hiddenNodeIds, (_a = {},
                _a[id] = true,
                _a));
            var _a;
        }, {});
    };
    TreeModel.prototype.performKeyAction = function (node, $event) {
        var action = this.options.actionMapping.keys[$event.keyCode];
        if (action) {
            $event.preventDefault();
            action(this, node, $event);
            return true;
        }
        else {
            return false;
        }
    };
    TreeModel.prototype.filterNodes = function (filter, autoShow) {
        var _this = this;
        if (autoShow === void 0) { autoShow = true; }
        var filterFn;
        if (!filter) {
            return this.clearFilter();
        }
        // support function and string filter
        if (isString(filter)) {
            filterFn = function (node) { return node.displayField.toLowerCase().indexOf(filter.toLowerCase()) !== -1; };
        }
        else if (isFunction(filter)) {
            filterFn = filter;
        }
        else {
            console.error('Don\'t know what to do with filter', filter);
            console.error('Should be either a string or function');
            return;
        }
        var ids = {};
        this.roots.forEach(function (node) { return _this._filterNode(ids, node, filterFn, autoShow); });
        this.hiddenNodeIds = ids;
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
    };
    TreeModel.prototype.clearFilter = function () {
        this.hiddenNodeIds = {};
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
    };
    TreeModel.prototype.moveNode = function (node, to) {
        var fromIndex = node.getIndexInParent();
        var fromParent = node.parent;
        if (!this._canMoveNode(node, fromIndex, to))
            return;
        var fromChildren = fromParent.getField('children');
        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', []);
        }
        var toChildren = to.parent.getField('children');
        var originalNode = fromChildren.splice(fromIndex, 1)[0];
        // Compensate for index if already removed from parent:
        var toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index;
        toChildren.splice(toIndex, 0, originalNode);
        fromParent.treeModel.update();
        if (to.parent.treeModel !== fromParent.treeModel) {
            to.parent.treeModel.update();
        }
        this.fireEvent({ eventName: TREE_EVENTS.moveNode, node: originalNode, to: { parent: to.parent.data, index: toIndex } });
    };
    TreeModel.prototype.copyNode = function (node, to) {
        var fromIndex = node.getIndexInParent();
        if (!this._canMoveNode(node, fromIndex, to))
            return;
        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', []);
        }
        var toChildren = to.parent.getField('children');
        var nodeCopy = this.options.getNodeClone(node);
        toChildren.splice(to.index, 0, nodeCopy);
        node.treeModel.update();
        if (to.parent.treeModel !== node.treeModel) {
            to.parent.treeModel.update();
        }
        this.fireEvent({ eventName: TREE_EVENTS.copyNode, node: nodeCopy, to: { parent: to.parent.data, index: to.index } });
    };
    TreeModel.prototype.getState = function () {
        return {
            expandedNodeIds: this.expandedNodeIds,
            activeNodeIds: this.activeNodeIds,
            hiddenNodeIds: this.hiddenNodeIds,
            focusedNodeId: this.focusedNodeId
        };
    };
    TreeModel.prototype.setState = function (state) {
        if (!state)
            return;
        Object.assign(this, {
            expandedNodeIds: state.expandedNodeIds || {},
            activeNodeIds: state.activeNodeIds || {},
            hiddenNodeIds: state.hiddenNodeIds || {},
            focusedNodeId: state.focusedNodeId
        });
    };
    TreeModel.prototype.subscribeToState = function (fn) {
        var _this = this;
        autorun(function () { return fn(_this.getState()); });
    };
    // private methods
    TreeModel.prototype._canMoveNode = function (node, fromIndex, to) {
        // same node:
        if (node.parent === to.parent && fromIndex === to.index) {
            return false;
        }
        return !to.parent.isDescendantOf(node);
    };
    TreeModel.prototype._filterNode = function (ids, node, filterFn, autoShow) {
        var _this = this;
        // if node passes function then it's visible
        var isVisible = filterFn(node);
        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach(function (child) {
                if (_this._filterNode(ids, child, filterFn, autoShow)) {
                    isVisible = true;
                }
            });
        }
        // mark node as hidden
        if (!isVisible) {
            ids[node.id] = true;
        }
        // auto expand parents to make sure the filtered nodes are visible
        if (autoShow && isVisible) {
            node.ensureVisible();
        }
        return isVisible;
    };
    TreeModel.prototype._calculateExpandedNodes = function (startNode) {
        var _this = this;
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (startNode.data[this.options.isExpandedField]) {
            this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[startNode.id] = true, _a));
        }
        if (startNode.children) {
            startNode.children.forEach(function (child) { return _this._calculateExpandedNodes(child); });
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeSingle = function (node, value) {
        var _this = this;
        // Deactivate all other nodes:
        this.activeNodes
            .filter(function (activeNode) { return activeNode !== node; })
            .forEach(function (activeNode) {
            _this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: activeNode });
        });
        if (value) {
            this.activeNodeIds = (_a = {}, _a[node.id] = true, _a);
        }
        else {
            this.activeNodeIds = {};
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeMulti = function (node, value) {
        this.activeNodeIds = Object.assign({}, this.activeNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    TreeModel.focusedTree = null;
    TreeModel.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TreeModel.ctorParameters = function () { return []; };
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], TreeModel.prototype, "roots", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeModel.prototype, "expandedNodeIds", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeModel.prototype, "activeNodeIds", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeModel.prototype, "hiddenNodeIds", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeModel.prototype, "focusedNodeId", void 0);
    __decorate([
        observable,
        __metadata("design:type", TreeNode)
    ], TreeModel.prototype, "virtualRoot", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeModel.prototype, "focusedNode", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeModel.prototype, "expandedNodes", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeModel.prototype, "activeNodes", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setData", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "update", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setFocusedNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setFocus", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "doForAll", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "focusNextNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "focusPreviousNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "focusDrillDown", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "focusDrillUp", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setActiveNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setExpandedNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "expandAll", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "collapseAll", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setIsHidden", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setHiddenNodeIds", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "filterNodes", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "clearFilter", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "moveNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "copyNode", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeModel.prototype, "setState", null);
    return TreeModel;
}());
export { TreeModel };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBQSxFQUF5QixNQUFPLGVBQUEsQ0FBZ0I7QUFDekQsT0FBTyxFQUFFLFVBQUEsRUFBWSxRQUFBLEVBQVUsTUFBQSxFQUFRLE9BQUEsRUFBUSxNQUFPLE1BQUEsQ0FBTztBQUM3RCxPQUFPLEVBQUUsUUFBQSxFQUFTLE1BQU8sbUJBQUEsQ0FBb0I7QUFDN0MsT0FBTyxFQUFFLFdBQUEsRUFBWSxNQUFPLHNCQUFBLENBQXVCO0FBR25ELE9BQU8sRUFBRSxXQUFBLEVBQVksTUFBTyxxQkFBQSxDQUFzQjtBQUVsRCxPQUFPLEtBQUssQ0FBQSxNQUFPLFFBQUEsQ0FBUztBQUVwQixJQUFBLGVBQUEsRUFBTyxhQUFBLEVBQU0sbUJBQUEsRUFBUyxhQUFBLEVBQU0scUJBQUEsRUFDbEMsaUJBQU0sRUFBRSxtQkFBQSxFQUFTLGlCQUFBLEVBQVEscUJBQUEsRUFBVSx5QkFBQSxDQUFpQjtBQUd0RDtJQWtCRTtRQWZBLFlBQU8sR0FBZ0IsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUV6QyxlQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUkxQixvQkFBZSxHQUFxQixFQUFFLENBQUM7UUFDdkMsa0JBQWEsR0FBcUIsRUFBRSxDQUFDO1FBQ3JDLGtCQUFhLEdBQXFCLEVBQUUsQ0FBQztRQUNyQyxrQkFBYSxHQUFXLElBQUksQ0FBQztRQUdqQyxnQkFBVyxHQUFHLElBQUksQ0FBQztJQUkzQixDQUFDO0lBRUQsU0FBUztJQUNULDZCQUFTLEdBQVQsVUFBVSxLQUFLO1FBQ2IsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxN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QUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRXJELElBQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckQsd0RBQXdEO1FBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQ0QsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFbEQsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUQsdURBQXVEO1FBQ3ZELElBQUksT0FBTyxHQUFHLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBRTNGLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1QyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FB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TUFBTTs7OztxREFJTjtJQWFPO1FBQVAsTUFBTTs7OztnREF3Qk47SUFFTztRQUFQLE1BQU07Ozs7Z0RBR047SUFFTztRQUFQLE1BQU07Ozs7NkNBMkJOO0lBRU87UUFBUCxNQUFNOzs7OzZDQXFCTjtJQVdPO1FBQVAsTUFBTTs7Ozs2Q0FTTjtJQThFSCxnQkFBQztDQXZjRCxBQXVjQyxJQUFBO1NBdmNZLFNBQVMiLCJmaWxlIjoidHJlZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG9ic2VydmFibGUsIGNvbXB1dGVkLCBhY3Rpb24sIGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU9wdGlvbnMgfSBmcm9tICcuL3RyZWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlVmlydHVhbFNjcm9sbCB9IGZyb20gJy4vdHJlZS12aXJ0dWFsLXNjcm9sbC5tb2RlbCc7XG5pbXBvcnQgeyBJVHJlZU1vZGVsLCBJRFR5cGUsIElEVHlwZURpY3Rpb25hcnkgfSBmcm9tICcuLi9kZWZzL2FwaSc7XG5pbXBvcnQgeyBUUkVFX0VWRU5UUyB9IGZyb20gJy4uL2NvbnN0YW50cy9ldmVudHMnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IHsgZmlyc3QsIGxhc3QsIGNvbXBhY3QsIGZpbmQsIGluY2x1ZGVzLFxuICByZW1vdmUsIGluZGV4T2YsIHB1bGxBdCwgaXNTdHJpbmcsIGlzRnVuY3Rpb24gfSA9IF87XG5cblxuZXhwb3J0IGNsYXNzIFRyZWVNb2RlbCBpbXBsZW1lbnRzIElUcmVlTW9kZWwge1xuICBzdGF0aWMgZm9jdXNlZFRyZWUgPSBudWxsO1xuXG4gIG9wdGlvbnM6IFRyZWVPcHRpb25zID0gbmV3IFRyZWVPcHRpb25zKCk7XG4gIG5vZGVzOiBhbnlbXTtcbiAgZXZlbnROYW1lcyA9IE9iamVjdC5rZXlzKFRSRUVfRVZFTlRTKTtcbiAgdmlydHVhbFNjcm9sbDogVHJlZVZpcnR1YWxTY3JvbGw7XG5cbiAgQG9ic2VydmFibGUgcm9vdHM6IFRyZWVOb2RlW107XG4gIEBvYnNlcnZhYmxlIGV4cGFuZGVkTm9kZUlkczogSURUeXBlRGljdGlvbmFyeSA9IHt9O1xuICBAb2JzZXJ2YWJsZSBhY3RpdmVOb2RlSWRzOiBJRFR5cGVEaWN0aW9uYXJ5ID0ge307XG4gIEBvYnNlcnZhYmxlIGhpZGRlbk5vZGVJZHM6IElEVHlwZURpY3Rpb25hcnkgPSB7fTtcbiAgQG9ic2VydmFibGUgZm9jdXNlZE5vZGVJZDogSURUeXBlID0gbnVsbDtcbiAgQG9ic2VydmFibGUgdmlydHVhbFJvb3Q6IFRyZWVOb2RlO1xuXG4gIHByaXZhdGUgZmlyc3RVcGRhdGUgPSB0cnVlO1xuICBwcml2YXRlIGV2ZW50czogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLy8gZXZlbnRzXG4gIGZpcmVFdmVudChldmVudCkge1xuICAgIGV2ZW50LnRyZWVNb2RlbCA9IHRoaXM7XG4gICAgdGhpcy5ldmVudHNbZXZlbnQuZXZlbnROYW1lXS5lbWl0KGV2ZW50KTtcbiAgICB0aGlzLmV2ZW50cy5ldmVudC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHN1YnNjcmliZShldmVudE5hbWUsIGZuKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgLy8gZ2V0dGVyc1xuICBnZXRGb2N1c2VkTm9kZSgpOiBUcmVlTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZE5vZGU7XG4gIH1cblxuICBnZXRBY3RpdmVOb2RlKCk6IFRyZWVOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVOb2Rlc1swXTtcbiAgfVxuXG4gIGdldEFjdGl2ZU5vZGVzKCk6IFRyZWVOb2RlW10ge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZU5vZGVzO1xuICB9XG5cbiAgZ2V0VmlzaWJsZVJvb3RzKCkge1xuICAgIHJldHVybiB0aGlzLnZpcnR1YWxSb290LnZpc2libGVDaGlsZHJlbjtcbiAgfVxuXG4gIGdldEZpcnN0Um9vdChza2lwSGlkZGVuID0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmlyc3Qoc2tpcEhpZGRlbiA/IHRoaXMuZ2V0VmlzaWJsZVJvb3RzKCkgOiB0aGlzLnJvb3RzKTtcbiAgfVxuXG4gIGdldExhc3RSb290KHNraXBIaWRkZW4gPSBmYWxzZSkge1xuICAgIHJldHVybiBsYXN0KHNraXBIaWRkZW4gPyB0aGlzLmdldFZpc2libGVSb290cygpIDogdGhpcy5yb290cyk7XG4gIH1cblxuICBnZXQgaXNGb2N1c2VkKCkge1xuICAgIHJldHVybiBUcmVlTW9kZWwuZm9jdXNlZFRyZWUgPT09IHRoaXM7XG4gIH1cblxuICBpc05vZGVGb2N1c2VkKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkTm9kZSA9PT0gbm9kZTtcbiAgfVxuXG4gIGlzRW1wdHlUcmVlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJvb3RzICYmIHRoaXMucm9vdHMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBmb2N1c2VkTm9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkTm9kZUlkID8gdGhpcy5nZXROb2RlQnlJZCh0aGlzLmZvY3VzZWROb2RlSWQpIDogbnVsbDtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgZXhwYW5kZWROb2RlcygpIHtcbiAgICBjb25zdCBub2RlcyA9IE9iamVjdC5rZXlzKHRoaXMuZXhwYW5kZWROb2RlSWRzKVxuICAgICAgLmZpbHRlcigoaWQpID0+IHRoaXMuZXhwYW5kZWROb2RlSWRzW2lkXSlcbiAgICAgIC5tYXAoKGlkKSA9PiB0aGlzLmdldE5vZGVCeUlkKGlkKSk7XG5cbiAgICByZXR1cm4gY29tcGFjdChub2Rlcyk7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGFjdGl2ZU5vZGVzKCkge1xuICAgIGNvbnN0IG5vZGVzID0gT2JqZWN0LmtleXModGhpcy5hY3RpdmVOb2RlSWRzKVxuICAgICAgLmZpbHRlcigoaWQpID0+IHRoaXMuYWN0aXZlTm9kZUlkc1tpZF0pXG4gICAgICAubWFwKChpZCkgPT4gdGhpcy5nZXROb2RlQnlJZChpZCkpO1xuXG4gICAgcmV0dXJuIGNvbXBhY3Qobm9kZXMpO1xuICB9XG5cbiAgLy8gbG9jYXRpbmcgbm9kZXNcbiAgZ2V0Tm9kZUJ5UGF0aChwYXRoOiBhbnlbXSwgc3RhcnROb2RlPSBudWxsKTogVHJlZU5vZGUge1xuICAgIGlmICghcGF0aCkgcmV0dXJuIG51bGw7XG5cbiAgICBzdGFydE5vZGUgPSBzdGFydE5vZGUgfHwgdGhpcy52aXJ0dWFsUm9vdDtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiBzdGFydE5vZGU7XG5cbiAgICBpZiAoIXN0YXJ0Tm9kZS5jaGlsZHJlbikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBjaGlsZElkID0gcGF0aC5zaGlmdCgpO1xuICAgIGNvbnN0IGNoaWxkTm9kZSA9IGZpbmQoc3RhcnROb2RlLmNoaWxkcmVuLCB7IGlkOiBjaGlsZElkIH0pO1xuXG4gICAgaWYgKCFjaGlsZE5vZGUpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZUJ5UGF0aChwYXRoLCBjaGlsZE5vZGUpO1xuICB9XG5cbiAgZ2V0Tm9kZUJ5SWQoaWQpIHtcbiAgICBjb25zdCBpZFN0ciA9IGlkLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy5nZXROb2RlQnkoKG5vZGUpID0+IG5vZGUuaWQudG9TdHJpbmcoKSA9PT0gaWRTdHIpO1xuICB9XG5cbiAgZ2V0Tm9kZUJ5KHByZWRpY2F0ZSwgc3RhcnROb2RlID0gbnVsbCkge1xuICAgIHN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZSB8fCB0aGlzLnZpcnR1YWxSb290O1xuXG4gICAgaWYgKCFzdGFydE5vZGUuY2hpbGRyZW4pIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZm91bmQgPSBmaW5kKHN0YXJ0Tm9kZS5jaGlsZHJlbiwgcHJlZGljYXRlKTtcblxuICAgIGlmIChmb3VuZCkgeyAvLyBmb3VuZCBpbiBjaGlsZHJlblxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0gZWxzZSB7IC8vIGxvb2sgaW4gY2hpbGRyZW4ncyBjaGlsZHJlblxuICAgICAgZm9yIChsZXQgY2hpbGQgb2Ygc3RhcnROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IGZvdW5kSW5DaGlsZHJlbiA9IHRoaXMuZ2V0Tm9kZUJ5KHByZWRpY2F0ZSwgY2hpbGQpO1xuICAgICAgICBpZiAoZm91bmRJbkNoaWxkcmVuKSByZXR1cm4gZm91bmRJbkNoaWxkcmVuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzRXhwYW5kZWQobm9kZSkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGVkTm9kZUlkc1tub2RlLmlkXTtcbiAgfVxuXG4gIGlzSGlkZGVuKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5oaWRkZW5Ob2RlSWRzW25vZGUuaWRdO1xuICB9XG5cbiAgaXNBY3RpdmUobm9kZSkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZU5vZGVJZHNbbm9kZS5pZF07XG4gIH1cblxuICAvLyBhY3Rpb25zXG4gIEBhY3Rpb24gc2V0RGF0YSh7IG5vZGVzLCBvcHRpb25zID0gbnVsbCwgZXZlbnRzID0gbnVsbCB9OiB7bm9kZXM6IGFueSwgb3B0aW9uczogYW55LCBldmVudHM6IGFueX0pIHtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gbmV3IFRyZWVPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoZXZlbnRzKSB7XG4gICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICB9XG4gICAgaWYgKG5vZGVzKSB7XG4gICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIEBhY3Rpb24gdXBkYXRlKCkge1xuICAgIC8vIFJlYnVpbGQgdHJlZTpcbiAgICBsZXQgdmlydHVhbFJvb3RDb25maWcgPSB7XG4gICAgICB2aXJ0dWFsOiB0cnVlLFxuICAgICAgW3RoaXMub3B0aW9ucy5jaGlsZHJlbkZpZWxkXTogdGhpcy5ub2Rlc1xuICAgIH07XG5cbiAgICB0aGlzLnZpcnR1YWxSb290ID0gbmV3IFRyZWVOb2RlKHZpcnR1YWxSb290Q29uZmlnLCBudWxsLCB0aGlzLCAwKTtcblxuICAgIHRoaXMucm9vdHMgPSB0aGlzLnZpcnR1YWxSb290LmNoaWxkcmVuO1xuXG4gICAgLy8gRmlyZSBldmVudDpcbiAgICBpZiAodGhpcy5maXJzdFVwZGF0ZSkge1xuICAgICAgaWYgKHRoaXMucm9vdHMpIHtcbiAgICAgICAgdGhpcy5maXJzdFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVFeHBhbmRlZE5vZGVzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy51cGRhdGVEYXRhIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgQGFjdGlvbiBzZXRGb2N1c2VkTm9kZShub2RlKSB7XG4gICAgdGhpcy5mb2N1c2VkTm9kZUlkID0gbm9kZSA/IG5vZGUuaWQgOiBudWxsO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRGb2N1cyh2YWx1ZSkge1xuICAgIFRyZWVNb2RlbC5mb2N1c2VkVHJlZSA9IHZhbHVlID8gdGhpcyA6IG51bGw7XG4gIH1cblxuICBAYWN0aW9uIGRvRm9yQWxsKGZuKSB7XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChyb290KSA9PiByb290LmRvRm9yQWxsKGZuKSk7XG4gIH1cblxuICBAYWN0aW9uIGZvY3VzTmV4dE5vZGUoKSB7XG4gICAgbGV0IHByZXZpb3VzTm9kZSA9IHRoaXMuZ2V0Rm9jdXNlZE5vZGUoKTtcbiAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUgPyBwcmV2aW91c05vZGUuZmluZE5leHROb2RlKHRydWUsIHRydWUpIDogdGhpcy5nZXRGaXJzdFJvb3QodHJ1ZSk7XG4gICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICB9XG5cbiAgQGFjdGlvbiBmb2N1c1ByZXZpb3VzTm9kZSgpIHtcbiAgICBsZXQgcHJldmlvdXNOb2RlID0gdGhpcy5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIGxldCBuZXh0Tm9kZSA9IHByZXZpb3VzTm9kZSA/IHByZXZpb3VzTm9kZS5maW5kUHJldmlvdXNOb2RlKHRydWUpIDogdGhpcy5nZXRMYXN0Um9vdCh0cnVlKTtcbiAgICBpZiAobmV4dE5vZGUpIG5leHROb2RlLmZvY3VzKCk7XG4gIH1cblxuICBAYWN0aW9uIGZvY3VzRHJpbGxEb3duKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLmdldEZvY3VzZWROb2RlKCk7XG4gICAgaWYgKHByZXZpb3VzTm9kZSAmJiBwcmV2aW91c05vZGUuaXNDb2xsYXBzZWQgJiYgcHJldmlvdXNOb2RlLmhhc0NoaWxkcmVuKSB7XG4gICAgICBwcmV2aW91c05vZGUudG9nZ2xlRXhwYW5kZWQoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUgPyBwcmV2aW91c05vZGUuZ2V0Rmlyc3RDaGlsZCh0cnVlKSA6IHRoaXMuZ2V0Rmlyc3RSb290KHRydWUpO1xuICAgICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gZm9jdXNEcmlsbFVwKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLmdldEZvY3VzZWROb2RlKCk7XG4gICAgaWYgKCFwcmV2aW91c05vZGUpIHJldHVybjtcbiAgICBpZiAocHJldmlvdXNOb2RlLmlzRXhwYW5kZWQpIHtcbiAgICAgIHByZXZpb3VzTm9kZS50b2dnbGVFeHBhbmRlZCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBuZXh0Tm9kZSA9IHByZXZpb3VzTm9kZS5yZWFsUGFyZW50O1xuICAgICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gc2V0QWN0aXZlTm9kZShub2RlLCB2YWx1ZSwgbXVsdGkgPSBmYWxzZSkge1xuICAgIGlmIChtdWx0aSkge1xuICAgICAgdGhpcy5fc2V0QWN0aXZlTm9kZU11bHRpKG5vZGUsIHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9zZXRBY3RpdmVOb2RlU2luZ2xlKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIG5vZGUuZm9jdXMoKTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5hY3RpdmF0ZSwgbm9kZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLmRlYWN0aXZhdGUsIG5vZGUgfSk7XG4gICAgfVxuICB9XG5cbiAgQGFjdGlvbiBzZXRFeHBhbmRlZE5vZGUobm9kZSwgdmFsdWUpIHtcbiAgICB0aGlzLmV4cGFuZGVkTm9kZUlkcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZXhwYW5kZWROb2RlSWRzLCB7W25vZGUuaWRdOiB2YWx1ZX0pO1xuICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy50b2dnbGVFeHBhbmRlZCwgbm9kZSwgaXNFeHBhbmRlZDogdmFsdWUgfSk7XG4gIH1cblxuICBAYWN0aW9uIGV4cGFuZEFsbCgpIHtcbiAgICB0aGlzLnJvb3RzLmZvckVhY2goKHJvb3QpID0+IHJvb3QuZXhwYW5kQWxsKCkpO1xuICB9XG5cbiAgQGFjdGlvbiBjb2xsYXBzZUFsbCgpIHtcbiAgICB0aGlzLnJvb3RzLmZvckVhY2goKHJvb3QpID0+IHJvb3QuY29sbGFwc2VBbGwoKSk7XG4gIH1cblxuICBAYWN0aW9uIHNldElzSGlkZGVuKG5vZGUsIHZhbHVlKSB7XG4gICAgdGhpcy5oaWRkZW5Ob2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaWRkZW5Ob2RlSWRzLCB7W25vZGUuaWRdOiB2YWx1ZX0pO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRIaWRkZW5Ob2RlSWRzKG5vZGVJZHMpIHtcbiAgICB0aGlzLmhpZGRlbk5vZGVJZHMgPSBub2RlSWRzLnJlZHVjZSgoaWQsIGhpZGRlbk5vZGVJZHMpID0+IE9iamVjdC5hc3NpZ24oaGlkZGVuTm9kZUlkcywge1xuICAgICAgW2lkXTogdHJ1ZVxuICAgIH0pLCB7fSk7XG4gIH1cblxuICBwZXJmb3JtS2V5QWN0aW9uKG5vZGUsICRldmVudCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMub3B0aW9ucy5hY3Rpb25NYXBwaW5nLmtleXNbJGV2ZW50LmtleUNvZGVdO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgYWN0aW9uKHRoaXMsIG5vZGUsICRldmVudCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gZmlsdGVyTm9kZXMoZmlsdGVyLCBhdXRvU2hvdyA9IHRydWUpIHtcbiAgICBsZXQgZmlsdGVyRm47XG5cbiAgICBpZiAoIWZpbHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXJGaWx0ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0IGZ1bmN0aW9uIGFuZCBzdHJpbmcgZmlsdGVyXG4gICAgaWYgKGlzU3RyaW5nKGZpbHRlcikpIHtcbiAgICAgIGZpbHRlckZuID0gKG5vZGUpID0+IG5vZGUuZGlzcGxheUZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKGZpbHRlcikpIHtcbiAgICAgICBmaWx0ZXJGbiA9IGZpbHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdEb25cXCd0IGtub3cgd2hhdCB0byBkbyB3aXRoIGZpbHRlcicsIGZpbHRlcik7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaG91bGQgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGZ1bmN0aW9uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0ge307XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChub2RlKSA9PiB0aGlzLl9maWx0ZXJOb2RlKGlkcywgbm9kZSwgZmlsdGVyRm4sIGF1dG9TaG93KSk7XG4gICAgdGhpcy5oaWRkZW5Ob2RlSWRzID0gaWRzO1xuICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5jaGFuZ2VGaWx0ZXIgfSk7XG4gIH1cblxuICBAYWN0aW9uIGNsZWFyRmlsdGVyKCkge1xuICAgIHRoaXMuaGlkZGVuTm9kZUlkcyA9IHt9O1xuICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5jaGFuZ2VGaWx0ZXIgfSk7XG4gIH1cblxuICBAYWN0aW9uIG1vdmVOb2RlKG5vZGUsIHRvKSB7XG4gICAgY29uc3QgZnJvbUluZGV4ID0gbm9kZS5nZXRJbmRleEluUGFyZW50KCk7XG4gICAgY29uc3QgZnJvbVBhcmVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgaWYgKCF0aGlzLl9jYW5Nb3ZlTm9kZShub2RlLCBmcm9tSW5kZXggLCB0bykpIHJldHVybjtcblxuICAgIGNvbnN0IGZyb21DaGlsZHJlbiA9IGZyb21QYXJlbnQuZ2V0RmllbGQoJ2NoaWxkcmVuJyk7XG5cbiAgICAvLyBJZiBub2RlIGRvZXNuJ3QgaGF2ZSBjaGlsZHJlbiAtIGNyZWF0ZSBjaGlsZHJlbiBhcnJheVxuICAgIGlmICghdG8ucGFyZW50LmdldEZpZWxkKCdjaGlsZHJlbicpKSB7XG4gICAgICB0by5wYXJlbnQuc2V0RmllbGQoJ2NoaWxkcmVuJywgW10pO1xuICAgIH1cbiAgICBjb25zdCB0b0NoaWxkcmVuID0gdG8ucGFyZW50LmdldEZpZWxkKCdjaGlsZHJlbicpO1xuXG4gICAgY29uc3Qgb3JpZ2luYWxOb2RlID0gZnJvbUNoaWxkcmVuLnNwbGljZShmcm9tSW5kZXgsIDEpWzBdO1xuXG4gICAgLy8gQ29tcGVuc2F0ZSBmb3IgaW5kZXggaWYgYWxyZWFkeSByZW1vdmVkIGZyb20gcGFyZW50OlxuICAgIGxldCB0b0luZGV4ID0gKGZyb21QYXJlbnQgPT09IHRvLnBhcmVudCAmJiB0by5pbmRleCA+IGZyb21JbmRleCkgPyB0by5pbmRleCAtIDEgOiB0by5pbmRleDtcblxuICAgIHRvQ2hpbGRyZW4uc3BsaWNlKHRvSW5kZXgsIDAsIG9yaWdpbmFsTm9kZSk7XG5cbiAgICBmcm9tUGFyZW50LnRyZWVNb2RlbC51cGRhdGUoKTtcbiAgICBpZiAodG8ucGFyZW50LnRyZWVNb2RlbCAhPT0gZnJvbVBhcmVudC50cmVlTW9kZWwpIHtcbiAgICAgIHRvLnBhcmVudC50cmVlTW9kZWwudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm1vdmVOb2RlLCBub2RlOiBvcmlnaW5hbE5vZGUsIHRvOiB7IHBhcmVudDogdG8ucGFyZW50LmRhdGEsIGluZGV4OiB0b0luZGV4IH0gfSk7XG4gIH1cblxuICBAYWN0aW9uIGNvcHlOb2RlKG5vZGUsIHRvKSB7XG4gICAgY29uc3QgZnJvbUluZGV4ID0gbm9kZS5nZXRJbmRleEluUGFyZW50KCk7XG5cbiAgICBpZiAoIXRoaXMuX2Nhbk1vdmVOb2RlKG5vZGUsIGZyb21JbmRleCAsIHRvKSkgcmV0dXJuO1xuXG4gICAgLy8gSWYgbm9kZSBkb2Vzbid0IGhhdmUgY2hpbGRyZW4gLSBjcmVhdGUgY2hpbGRyZW4gYXJyYXlcbiAgICBpZiAoIXRvLnBhcmVudC5nZXRGaWVsZCgnY2hpbGRyZW4nKSkge1xuICAgICAgdG8ucGFyZW50LnNldEZpZWxkKCdjaGlsZHJlbicsIFtdKTtcbiAgICB9XG4gICAgY29uc3QgdG9DaGlsZHJlbiA9IHRvLnBhcmVudC5nZXRGaWVsZCgnY2hpbGRyZW4nKTtcblxuICAgIGNvbnN0IG5vZGVDb3B5ID0gdGhpcy5vcHRpb25zLmdldE5vZGVDbG9uZShub2RlKTtcblxuICAgIHRvQ2hpbGRyZW4uc3BsaWNlKHRvLmluZGV4LCAwLCBub2RlQ29weSk7XG5cbiAgICBub2RlLnRyZWVNb2RlbC51cGRhdGUoKTtcbiAgICBpZiAodG8ucGFyZW50LnRyZWVNb2RlbCAhPT0gbm9kZS50cmVlTW9kZWwpIHtcbiAgICAgIHRvLnBhcmVudC50cmVlTW9kZWwudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLmNvcHlOb2RlLCBub2RlOiBub2RlQ29weSwgdG86IHsgcGFyZW50OiB0by5wYXJlbnQuZGF0YSwgaW5kZXg6IHRvLmluZGV4IH0gfSk7XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwYW5kZWROb2RlSWRzOiB0aGlzLmV4cGFuZGVkTm9kZUlkcyxcbiAgICAgIGFjdGl2ZU5vZGVJZHM6IHRoaXMuYWN0aXZlTm9kZUlkcyxcbiAgICAgIGhpZGRlbk5vZGVJZHM6IHRoaXMuaGlkZGVuTm9kZUlkcyxcbiAgICAgIGZvY3VzZWROb2RlSWQ6IHRoaXMuZm9jdXNlZE5vZGVJZFxuICAgIH07XG4gIH1cblxuICBAYWN0aW9uIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICBleHBhbmRlZE5vZGVJZHM6IHN0YXRlLmV4cGFuZGVkTm9kZUlkcyB8fCB7fSxcbiAgICAgIGFjdGl2ZU5vZGVJZHM6IHN0YXRlLmFjdGl2ZU5vZGVJZHMgfHwge30sXG4gICAgICBoaWRkZW5Ob2RlSWRzOiBzdGF0ZS5oaWRkZW5Ob2RlSWRzIHx8IHt9LFxuICAgICAgZm9jdXNlZE5vZGVJZDogc3RhdGUuZm9jdXNlZE5vZGVJZFxuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlVG9TdGF0ZShmbikge1xuICAgIGF1dG9ydW4oKCkgPT4gZm4odGhpcy5nZXRTdGF0ZSgpKSk7XG4gIH1cblxuICAvLyBwcml2YXRlIG1ldGhvZHNcbiAgcHJpdmF0ZSBfY2FuTW92ZU5vZGUobm9kZSwgZnJvbUluZGV4LCB0bykge1xuICAgIC8vIHNhbWUgbm9kZTpcbiAgICBpZiAobm9kZS5wYXJlbnQgPT09IHRvLnBhcmVudCAmJiBmcm9tSW5kZXggPT09IHRvLmluZGV4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0by5wYXJlbnQuaXNEZXNjZW5kYW50T2Yobm9kZSk7XG4gIH1cblxuXG4gIHByaXZhdGUgX2ZpbHRlck5vZGUoaWRzLCBub2RlLCBmaWx0ZXJGbiwgYXV0b1Nob3cpIHtcbiAgICAvLyBpZiBub2RlIHBhc3NlcyBmdW5jdGlvbiB0aGVuIGl0J3MgdmlzaWJsZVxuICAgIGxldCBpc1Zpc2libGUgPSBmaWx0ZXJGbihub2RlKTtcblxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAvLyBpZiBvbmUgb2Ygbm9kZSdzIGNoaWxkcmVuIHBhc3NlcyBmaWx0ZXIgdGhlbiB0aGlzIG5vZGUgaXMgYWxzbyB2aXNpYmxlXG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9maWx0ZXJOb2RlKGlkcywgY2hpbGQsIGZpbHRlckZuLCBhdXRvU2hvdykpIHtcbiAgICAgICAgICBpc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBtYXJrIG5vZGUgYXMgaGlkZGVuXG4gICAgaWYgKCFpc1Zpc2libGUpIHtcbiAgICAgIGlkc1tub2RlLmlkXSA9IHRydWU7XG4gICAgfVxuICAgIC8vIGF1dG8gZXhwYW5kIHBhcmVudHMgdG8gbWFrZSBzdXJlIHRoZSBmaWx0ZXJlZCBub2RlcyBhcmUgdmlzaWJsZVxuICAgIGlmIChhdXRvU2hvdyAmJiBpc1Zpc2libGUpIHtcbiAgICAgIG5vZGUuZW5zdXJlVmlzaWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gaXNWaXNpYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlRXhwYW5kZWROb2RlcyhzdGFydE5vZGUgPSBudWxsKSB7XG4gICAgc3RhcnROb2RlID0gc3RhcnROb2RlIHx8IHRoaXMudmlydHVhbFJvb3Q7XG5cbiAgICBpZiAoc3RhcnROb2RlLmRhdGFbdGhpcy5vcHRpb25zLmlzRXhwYW5kZWRGaWVsZF0pIHtcbiAgICAgIHRoaXMuZXhwYW5kZWROb2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5leHBhbmRlZE5vZGVJZHMsIHtbc3RhcnROb2RlLmlkXTogdHJ1ZX0pO1xuICAgIH1cbiAgICBpZiAoc3RhcnROb2RlLmNoaWxkcmVuKSB7XG4gICAgICBzdGFydE5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuX2NhbGN1bGF0ZUV4cGFuZGVkTm9kZXMoY2hpbGQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRBY3RpdmVOb2RlU2luZ2xlKG5vZGUsIHZhbHVlKSB7XG4gICAgLy8gRGVhY3RpdmF0ZSBhbGwgb3RoZXIgbm9kZXM6XG4gICAgdGhpcy5hY3RpdmVOb2Rlc1xuICAgICAgLmZpbHRlcigoYWN0aXZlTm9kZSkgPT4gYWN0aXZlTm9kZSAhPT0gbm9kZSlcbiAgICAgIC5mb3JFYWNoKChhY3RpdmVOb2RlKSA9PiB7XG4gICAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5kZWFjdGl2YXRlLCBub2RlOiBhY3RpdmVOb2RlIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuYWN0aXZlTm9kZUlkcyA9IHtbbm9kZS5pZF06IHRydWV9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlTm9kZUlkcyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldEFjdGl2ZU5vZGVNdWx0aShub2RlLCB2YWx1ZSkge1xuICAgIHRoaXMuYWN0aXZlTm9kZUlkcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuYWN0aXZlTm9kZUlkcywge1tub2RlLmlkXTogdmFsdWV9KTtcbiAgfVxuXG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBJbmplY3RhYmxlIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICgpID0+ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gKCkgPT4gW1xuXTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19