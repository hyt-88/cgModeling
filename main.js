/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer */ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass */ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_UnrealBloomPass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/postprocessing/UnrealBloomPass */ "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js");





class ThreeJSContainer {
    scene;
    camera;
    composer;
    laserLines = []; // レーザーライン
    clock;
    orbitControls;
    isLaserAnimationPaused = false; // レーザーアニメーション一時停止フラグ
    LASER_TARGET_Y = 0;
    LASER_TARGET_Z = 100;
    NUM_LASERS_PER_GROUP = 80; // レーザー群あたりの本数
    X_SPREAD_RANGE = 10; // X軸方向の片側への広がり範囲 (±10)
    FLASH_SPEED = 10;
    FLASH_MIN_OPACITY = 0.0;
    FLASH_MAX_OPACITY = 0.8;
    // 固定始点のリスト
    fixedStartPositions = [
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-6, 4, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 4, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(6, 4, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(3, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-3, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(9, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-9, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(3, 3.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-3, 3.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(9, 3.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-9, 3.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(12, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-12, 4.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(8, 5.5, -20),
        new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(-8, 5.5, -20)
    ];
    // 相対オフセットのリスト
    commonRelativeTargetOffsets = [];
    constructor() {
        this.clock = new three__WEBPACK_IMPORTED_MODULE_4__.Clock();
        this.generateCommonRelativeTargetOffsets();
    }
    generateCommonRelativeTargetOffsets = () => {
        const numLasers = this.NUM_LASERS_PER_GROUP;
        const spread = this.X_SPREAD_RANGE;
        this.commonRelativeTargetOffsets = [];
        for (let i = 0; i < numLasers; i++) {
            const relativeX = (numLasers > 1) ? (i / (numLasers - 1)) * (2 * spread) - spread : 0;
            this.commonRelativeTargetOffsets.push(new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(relativeX, this.LASER_TARGET_Y, this.LASER_TARGET_Z));
        }
    };
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_4__.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x000000));
        renderer.shadowMap.enabled = true;
        this.camera = new three__WEBPACK_IMPORTED_MODULE_4__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 0));
        this.orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, renderer.domElement);
        this.orbitControls.enabled = false;
        this.createScene();
        this.setupPostProcessing(renderer, this.scene, this.camera, width, height);
        this.updateLasers(0);
        const render = (time) => {
            if (!this.isLaserAnimationPaused) {
                const delta = this.clock.getDelta();
                this.updateLasers(delta);
            }
            else {
                this.clock.getDelta();
            }
            this.orbitControls.update();
            this.composer.render();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_4__.Scene();
        const floorGeometry = new three__WEBPACK_IMPORTED_MODULE_4__.PlaneGeometry(20, 20);
        const floorMaterial = new three__WEBPACK_IMPORTED_MODULE_4__.MeshPhongMaterial({ color: 0x111111, side: three__WEBPACK_IMPORTED_MODULE_4__.DoubleSide });
        const floor = new three__WEBPACK_IMPORTED_MODULE_4__.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -3;
        this.scene.add(floor);
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_4__.AmbientLight(0x111111);
        this.scene.add(ambientLight);
        // 各固定始点からレーザー群を生成
        this.fixedStartPositions.forEach((startPos, index) => {
            let groupId;
            let rotation = 0; // デフォルトは回転なし
            // group ID の割り当て
            if (index <= 2) {
                groupId = -1;
            }
            else if (index <= 6) {
                groupId = 1;
            }
            else if (index <= 10) {
                groupId = 0;
            }
            else {
                groupId = 2;
            }
            // 回転角度の割り当て
            if (index === 11 || index === 13) {
                rotation = three__WEBPACK_IMPORTED_MODULE_4__.MathUtils.degToRad(-45);
            }
            else if (index === 12 || index === 14) {
                rotation = three__WEBPACK_IMPORTED_MODULE_4__.MathUtils.degToRad(45);
            }
            this.generateLasersForGroup(startPos, groupId, rotation);
        });
    };
    getBaseColorForGroup = (groupId) => {
        switch (groupId) {
            case 0: return new three__WEBPACK_IMPORTED_MODULE_4__.Color(0xFF0000);
            case 1: return new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x0000FF);
            case -1: return new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x00FF00);
            case 2: return new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x00AEFF);
            default: return new three__WEBPACK_IMPORTED_MODULE_4__.Color(0xFFFFFF);
        }
    };
    generateLasersForGroup = (startPosition, groupId, rotation) => {
        const numLasersInGroup = this.commonRelativeTargetOffsets.length;
        for (let i = 0; i < numLasersInGroup; i++) {
            const baseColor = this.getBaseColorForGroup(groupId); // グループIDから基本色を取得
            const material = new three__WEBPACK_IMPORTED_MODULE_4__.LineBasicMaterial({
                color: baseColor,
                linewidth: 2,
                blending: three__WEBPACK_IMPORTED_MODULE_4__.AdditiveBlending,
                transparent: true,
                opacity: 0.5
            });
            const points = [];
            points.push(startPosition.clone()); // 始点
            const relativeOffset = this.commonRelativeTargetOffsets[i];
            // 終点ワールド座標の計算
            const rotatedRelativeOffset = relativeOffset.clone().clone().applyAxisAngle(new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(1, 1, 0), rotation); // 回転
            const targetWorldPosition = startPosition.clone().clone().add(rotatedRelativeOffset); // 始点に加算
            points.push(targetWorldPosition); // 終点
            const geometry = new three__WEBPACK_IMPORTED_MODULE_4__.BufferGeometry().setFromPoints(points);
            const line = new three__WEBPACK_IMPORTED_MODULE_4__.Line(geometry, material);
            this.scene.add(line);
            const initialTargetOffsetX = Math.random() * Math.PI * 2;
            this.laserLines.push({
                line: line,
                startPosition: startPosition,
                relativeTargetOffset: relativeOffset,
                initialTargetOffset: initialTargetOffsetX,
                groupId: groupId,
                rotation: rotation
            });
        }
    };
    // ポストエフェクトの設定
    setupPostProcessing = (renderer, scene, camera, width, height) => {
        this.composer = new three_examples_jsm_postprocessing_EffectComposer__WEBPACK_IMPORTED_MODULE_1__.EffectComposer(renderer);
        this.composer.addPass(new three_examples_jsm_postprocessing_RenderPass__WEBPACK_IMPORTED_MODULE_2__.RenderPass(scene, camera));
        const bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass__WEBPACK_IMPORTED_MODULE_3__.UnrealBloomPass(new three__WEBPACK_IMPORTED_MODULE_4__.Vector2(width, height), 0.5, 0.3, 0.98);
        this.composer.addPass(bloomPass);
    };
    // レーザーのアニメーション更新
    updateLasers = (delta) => {
        const time = this.clock.getElapsedTime();
        // 各グループIDのY軸のオフセットを計算 (グループIDに依存するアニメーション)
        const targetMovementScaleY = 1.5;
        const targetMovementSpeedY = 2;
        const groupYMap = new Map();
        const groupIds = [...new Set(this.laserLines.map(l => l.groupId))]; // ユニークなgroupIdのリスト
        for (const groupId of groupIds) {
            if (groupId === -1 || groupId === 2) {
                groupYMap.set(groupId, 0);
                continue;
            }
            const phase = groupId === 0 ? 0 : (groupId === 1 ? Math.PI : (groupId === 2 ? Math.PI / 2 : 0));
            const animatedY = Math.sin(time * targetMovementSpeedY + phase) * targetMovementScaleY;
            groupYMap.set(groupId, animatedY);
        }
        // 色変化
        const colorChangePeriod = 4.0;
        const uniqueGroupIds = [...new Set(this.laserLines.map(l => l.groupId))];
        const numGroups = uniqueGroupIds.length; // 色変化のグループ数
        this.laserLines.forEach((laserInfo) => {
            const line = laserInfo.line;
            const startPosition = laserInfo.startPosition;
            const relativeOffset = laserInfo.relativeTargetOffset; // 回転前の相対オフセット
            const initialTargetOffsetX = laserInfo.initialTargetOffset;
            const groupId = laserInfo.groupId;
            const rotation = laserInfo.rotation; // レーザー群の回転角度
            const positions = line.geometry.attributes.position.array;
            const startX = startPosition.x;
            const startY = startPosition.y;
            const startZ = startPosition.z;
            // グループIDに紐づくY軸オフセットを取得
            const offsetY = groupYMap.get(groupId) ?? 0;
            // 終点座標の計算に回転を適用
            const rotatedRelativeOffset = relativeOffset.clone().clone().applyAxisAngle(new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 0, 1), rotation);
            // 位置更新
            const targetBaseWorldX = startPosition.x + rotatedRelativeOffset.x;
            const targetBaseWorldY = startPosition.y + rotatedRelativeOffset.y + offsetY;
            const targetBaseWorldZ = startPosition.z + rotatedRelativeOffset.z;
            // X軸のアニメーション
            const targetMovementScaleX = 1.5;
            const targetMovementSpeedX = 0.8;
            const animatedTargetX = targetBaseWorldX + Math.sin(time * targetMovementSpeedX + initialTargetOffsetX) * targetMovementScaleX;
            const animatedTargetY = targetBaseWorldY;
            const animatedTargetZ = targetBaseWorldZ;
            positions.set([
                startX, startY, startZ,
                animatedTargetX, animatedTargetY, animatedTargetZ,
            ]);
            line.geometry.attributes.position.needsUpdate = true;
            // 色の周期変化
            if (groupId !== 2) { // groupId=2 以外のレーザーの色を周期変化
                const groupIndex = uniqueGroupIds.indexOf(laserInfo.groupId);
                const hueBase = groupIndex / numGroups;
                const hue = (hueBase + (time / colorChangePeriod)) % 1.0;
                const color = new three__WEBPACK_IMPORTED_MODULE_4__.Color();
                color.setHSL(hue, 1.0, 0.5);
                line.material.color = color;
                line.material.needsUpdate = true;
            }
            else { // groupId=2は点滅
                const flashValue = (Math.sin(time * this.FLASH_SPEED) + 1) / 2; // 0から1の範囲で変化する値
                const currentOpacity = this.FLASH_MIN_OPACITY + flashValue * (this.FLASH_MAX_OPACITY - this.FLASH_MIN_OPACITY);
                line.material.opacity = currentOpacity;
                line.material.needsUpdate = true;
            }
        });
    };
    toggleLaserAnimation = () => {
        this.isLaserAnimationPaused = !this.isLaserAnimationPaused;
        console.log(`Laser animation paused: ${this.isLaserAnimationPaused}`);
    };
    getOrbitControls = () => {
        return this.orbitControls;
    };
}
window.addEventListener("DOMContentLoaded", init);
let myThreeJSContainer;
function init() {
    myThreeJSContainer = new ThreeJSContainer();
    let viewport = myThreeJSContainer.createRendererDOM(window.innerWidth * 0.8, window.innerHeight * 0.8, new three__WEBPACK_IMPORTED_MODULE_4__.Vector3(0, 5, 12));
    document.body.appendChild(viewport);
    console.log("To toggle laser animation, call: myThreeJSContainer.toggleLaserAnimation()");
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_three_examples-476788"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VDOVVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IHsgRWZmZWN0Q29tcG9zZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXInO1xuaW1wb3J0IHsgUmVuZGVyUGFzcyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9SZW5kZXJQYXNzJztcbmltcG9ydCB7IFVucmVhbEJsb29tUGFzcyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9VbnJlYWxCbG9vbVBhc3MnO1xuXG4vLyDjg6zjg7zjgrbjg7zjg6njgqTjg7PjgajjgZ3jgozjgavplqLpgKPjgZnjgovmg4XloLHjgpLkv53mjIHjgZnjgovjgqTjg7Pjgr/jg7zjg5Xjgqfjg7zjgrlcbmludGVyZmFjZSBMYXNlckluZm8ge1xuICAgIGxpbmU6IFRIUkVFLkxpbmU7XG4gICAgc3RhcnRQb3NpdGlvbjogVEhSRUUuVmVjdG9yMzsgLy8g44Os44O844K244O844GM55m65bCE44GV44KM44KL5Zu65a6a5aeL54K5XG4gICAgcmVsYXRpdmVUYXJnZXRPZmZzZXQ6IFRIUkVFLlZlY3RvcjM7IC8vIOWni+eCueOBi+OCieOBruebuOWvvueahOOBque1gueCueOCquODleOCu+ODg+ODiFxuICAgIGluaXRpYWxUYXJnZXRPZmZzZXQ6IG51bWJlcjsgLy8g57WC54K544Ki44OL44Oh44O844K344On44Oz44Kq44OV44K744OD44OIXG4gICAgZ3JvdXBJZDogbnVtYmVyOyAvLyDjg6zjg7zjgrbjg7znvqTjga5JRFxuICAgIHJvdGF0aW9uOiBudW1iZXI7IC8vIOODrOODvOOCtuODvOe+pOOBlOOBqOOBruWbnui7ouinkuW6plxufVxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gICAgcHJpdmF0ZSBjb21wb3NlcjogRWZmZWN0Q29tcG9zZXI7XG4gICAgcHJpdmF0ZSBsYXNlckxpbmVzOiBMYXNlckluZm9bXSA9IFtdOyAvLyDjg6zjg7zjgrbjg7zjg6njgqTjg7NcbiAgICBwcml2YXRlIGNsb2NrOiBUSFJFRS5DbG9jaztcbiAgICBwcml2YXRlIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gICAgcHJpdmF0ZSBpc0xhc2VyQW5pbWF0aW9uUGF1c2VkOiBib29sZWFuID0gZmFsc2U7IC8vIOODrOODvOOCtuODvOOCouODi+ODoeODvOOCt+ODp+ODs+S4gOaZguWBnOatouODleODqeOCsFxuXG4gICAgcHJpdmF0ZSByZWFkb25seSBMQVNFUl9UQVJHRVRfWTogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IExBU0VSX1RBUkdFVF9aOiBudW1iZXIgPSAxMDA7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IE5VTV9MQVNFUlNfUEVSX0dST1VQOiBudW1iZXIgPSA4MDsgLy8g44Os44O844K244O8576k44GC44Gf44KK44Gu5pys5pWwXG4gICAgcHJpdmF0ZSByZWFkb25seSBYX1NQUkVBRF9SQU5HRTogbnVtYmVyID0gMTA7IC8vIFjou7jmlrnlkJHjga7niYflgbTjgbjjga7luoPjgYzjgornr4Tlm7IgKMKxMTApXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IEZMQVNIX1NQRUVEOiBudW1iZXIgPSAxMDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZMQVNIX01JTl9PUEFDSVRZOiBudW1iZXIgPSAwLjA7XG4gICAgcHJpdmF0ZSByZWFkb25seSBGTEFTSF9NQVhfT1BBQ0lUWTogbnVtYmVyID0gMC44O1xuXG5cbiAgICAvLyDlm7rlrprlp4vngrnjga7jg6rjgrnjg4hcbiAgICBwcml2YXRlIGZpeGVkU3RhcnRQb3NpdGlvbnM6IFRIUkVFLlZlY3RvcjNbXSA9IFtcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTYsIDQsIC0yMCksXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDQsIC0yMCksXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDYsIDQsIC0yMCksXG5cbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMywgNC41LCAtMjApLFxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMywgNC41LCAtMjApLFxuXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDksIDQuNSwgLTIwKSxcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTksIDQuNSwgLTIwKSxcblxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygzLCAzLjUsIC0yMCksXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0zLCAzLjUsIC0yMCksXG5cbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoOSwgMy41LCAtMjApLFxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtOSwgMy41LCAtMjApLFxuXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDEyLCA0LjUsIC0yMCksXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0xMiwgNC41LCAtMjApLFxuXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDgsIDUuNSwgLTIwKSxcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTgsIDUuNSwgLTIwKVxuICAgIF07XG5cbiAgICAvLyDnm7jlr77jgqrjg5Xjgrvjg4Pjg4jjga7jg6rjgrnjg4hcbiAgICBwcml2YXRlIGNvbW1vblJlbGF0aXZlVGFyZ2V0T2Zmc2V0czogVEhSRUUuVmVjdG9yM1tdID0gW107XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVDb21tb25SZWxhdGl2ZVRhcmdldE9mZnNldHMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlQ29tbW9uUmVsYXRpdmVUYXJnZXRPZmZzZXRzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBudW1MYXNlcnMgPSB0aGlzLk5VTV9MQVNFUlNfUEVSX0dST1VQO1xuICAgICAgICBjb25zdCBzcHJlYWQgPSB0aGlzLlhfU1BSRUFEX1JBTkdFO1xuXG4gICAgICAgIHRoaXMuY29tbW9uUmVsYXRpdmVUYXJnZXRPZmZzZXRzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1MYXNlcnM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVYID0gKG51bUxhc2VycyA+IDEpID8gKGkgLyAobnVtTGFzZXJzIC0gMSkpICogKDIgKiBzcHJlYWQpIC0gc3ByZWFkIDogMDtcblxuICAgICAgICAgICAgdGhpcy5jb21tb25SZWxhdGl2ZVRhcmdldE9mZnNldHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgICAgICAgICAgICByZWxhdGl2ZVgsXG4gICAgICAgICAgICAgICAgdGhpcy5MQVNFUl9UQVJHRVRfWSxcbiAgICAgICAgICAgICAgICB0aGlzLkxBU0VSX1RBUkdFVF9aXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgwMDAwMDApKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICB0aGlzLmNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIHRoaXMuc2V0dXBQb3N0UHJvY2Vzc2luZyhyZW5kZXJlciwgdGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlTGFzZXJzKDApO1xuXG5cbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMYXNlckFuaW1hdGlvblBhdXNlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5jbG9jay5nZXREZWx0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTGFzZXJzKGRlbHRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9jay5nZXREZWx0YSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29tcG9zZXIucmVuZGVyKCk7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIGNvbnN0IGZsb29yR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyMCwgMjApO1xuICAgICAgICBjb25zdCBmbG9vck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4MTExMTExLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pO1xuICAgICAgICBjb25zdCBmbG9vciA9IG5ldyBUSFJFRS5NZXNoKGZsb29yR2VvbWV0cnksIGZsb29yTWF0ZXJpYWwpO1xuICAgICAgICBmbG9vci5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICBmbG9vci5wb3NpdGlvbi55ID0gLTM7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGZsb29yKTtcblxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4MTExMTExKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcblxuICAgICAgICAvLyDlkITlm7rlrprlp4vngrnjgYvjgonjg6zjg7zjgrbjg7znvqTjgpLnlJ/miJBcbiAgICAgICAgdGhpcy5maXhlZFN0YXJ0UG9zaXRpb25zLmZvckVhY2goKHN0YXJ0UG9zLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IGdyb3VwSWQ6IG51bWJlcjtcbiAgICAgICAgICAgIGxldCByb3RhdGlvbjogbnVtYmVyID0gMDsgLy8g44OH44OV44Kp44Or44OI44Gv5Zue6Lui44Gq44GXXG5cbiAgICAgICAgICAgIC8vIGdyb3VwIElEIOOBruWJsuOCiuW9k+OBplxuICAgICAgICAgICAgaWYgKGluZGV4IDw9IDIpIHtcbiAgICAgICAgICAgICAgICBncm91cElkID0gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDw9IDYpIHtcbiAgICAgICAgICAgICAgICBncm91cElkID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPD0gMTApIHtcbiAgICAgICAgICAgICAgICBncm91cElkID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBJZCA9IDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWbnui7ouinkuW6puOBruWJsuOCiuW9k+OBplxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAxMSB8fCBpbmRleCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICByb3RhdGlvbiA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZCgtNDUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gMTIgfHwgaW5kZXggPT09IDE0KSB7XG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoNDUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlTGFzZXJzRm9yR3JvdXAoc3RhcnRQb3MsIGdyb3VwSWQsIHJvdGF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCYXNlQ29sb3JGb3JHcm91cCA9IChncm91cElkOiBudW1iZXIpOiBUSFJFRS5Db2xvciA9PiB7XG4gICAgICAgIHN3aXRjaCAoZ3JvdXBJZCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IFRIUkVFLkNvbG9yKDB4RkYwMDAwKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBUSFJFRS5Db2xvcigweDAwMDBGRik7XG4gICAgICAgICAgICBjYXNlIC0xOiByZXR1cm4gbmV3IFRIUkVFLkNvbG9yKDB4MDBGRjAwKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBUSFJFRS5Db2xvcigweDAwQUVGRik7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gbmV3IFRIUkVFLkNvbG9yKDB4RkZGRkZGKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVMYXNlcnNGb3JHcm91cCA9IChzdGFydFBvc2l0aW9uOiBUSFJFRS5WZWN0b3IzLCBncm91cElkOiBudW1iZXIsIHJvdGF0aW9uOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgbnVtTGFzZXJzSW5Hcm91cCA9IHRoaXMuY29tbW9uUmVsYXRpdmVUYXJnZXRPZmZzZXRzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUxhc2Vyc0luR3JvdXA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYmFzZUNvbG9yID0gdGhpcy5nZXRCYXNlQ29sb3JGb3JHcm91cChncm91cElkKTsgLy8g44Kw44Or44O844OXSUTjgYvjgonln7rmnKzoibLjgpLlj5blvpdcbiAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogYmFzZUNvbG9yLCAvLyDln7rmnKzoibLjgpLkvb/nlKhcbiAgICAgICAgICAgICAgICBsaW5ld2lkdGg6IDIsXG4gICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBUSFJFRS5WZWN0b3IzW10gPSBbXTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHN0YXJ0UG9zaXRpb24uY2xvbmUoKSk7IC8vIOWni+eCuVxuXG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZU9mZnNldCA9IHRoaXMuY29tbW9uUmVsYXRpdmVUYXJnZXRPZmZzZXRzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDntYLngrnjg6/jg7zjg6vjg4nluqfmqJnjga7oqIjnrpdcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0ZWRSZWxhdGl2ZU9mZnNldCA9IHJlbGF0aXZlT2Zmc2V0LmNsb25lKCkuYXBwbHlBeGlzQW5nbGUobmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMCksIHJvdGF0aW9uKTsgLy8g5Zue6LuiXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRXb3JsZFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbi5jbG9uZSgpLmFkZChyb3RhdGVkUmVsYXRpdmVPZmZzZXQpOyAvLyDlp4vngrnjgavliqDnrpdcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcG9pbnRzLnB1c2godGFyZ2V0V29ybGRQb3NpdGlvbik7IC8vIOe1gueCuVxuXG4gICAgICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpLnNldEZyb21Qb2ludHMocG9pbnRzKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobGluZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxUYXJnZXRPZmZzZXRYID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyO1xuXG4gICAgICAgICAgICB0aGlzLmxhc2VyTGluZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uOiBzdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIHJlbGF0aXZlVGFyZ2V0T2Zmc2V0OiByZWxhdGl2ZU9mZnNldCxcbiAgICAgICAgICAgICAgICBpbml0aWFsVGFyZ2V0T2Zmc2V0OiBpbml0aWFsVGFyZ2V0T2Zmc2V0WCxcbiAgICAgICAgICAgICAgICBncm91cElkOiBncm91cElkLFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiByb3RhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjga7oqK3lrppcbiAgICBwcml2YXRlIHNldHVwUG9zdFByb2Nlc3NpbmcgPSAocmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXIsIHNjZW5lOiBUSFJFRS5TY2VuZSwgY2FtZXJhOiBUSFJFRS5DYW1lcmEsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMuY29tcG9zZXIgPSBuZXcgRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICAgICAgICB0aGlzLmNvbXBvc2VyLmFkZFBhc3MobmV3IFJlbmRlclBhc3Moc2NlbmUsIGNhbWVyYSkpO1xuXG4gICAgICAgIGNvbnN0IGJsb29tUGFzcyA9IG5ldyBVbnJlYWxCbG9vbVBhc3MobmV3IFRIUkVFLlZlY3RvcjIod2lkdGgsIGhlaWdodCksIDAuNSwgMC4zLCAwLjk4KTtcbiAgICAgICAgdGhpcy5jb21wb3Nlci5hZGRQYXNzKGJsb29tUGFzcyk7XG4gICAgfVxuXG5cbiAgICAvLyDjg6zjg7zjgrbjg7zjga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7Pmm7TmlrBcbiAgICBwcml2YXRlIHVwZGF0ZUxhc2VycyA9IChkZWx0YTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICAgICAgLy8g5ZCE44Kw44Or44O844OXSUTjga5Z6Lu444Gu44Kq44OV44K744OD44OI44KS6KiI566XICjjgrDjg6vjg7zjg5dJROOBq+S+neWtmOOBmeOCi+OCouODi+ODoeODvOOCt+ODp+ODsylcbiAgICAgICAgY29uc3QgdGFyZ2V0TW92ZW1lbnRTY2FsZVkgPSAxLjU7XG4gICAgICAgIGNvbnN0IHRhcmdldE1vdmVtZW50U3BlZWRZID0gMjtcbiAgICAgICAgY29uc3QgZ3JvdXBZTWFwID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcbiAgICAgICAgY29uc3QgZ3JvdXBJZHMgPSBbLi4ubmV3IFNldCh0aGlzLmxhc2VyTGluZXMubWFwKGwgPT4gbC5ncm91cElkKSldOyAvLyDjg6bjg4vjg7zjgq/jgapncm91cElk44Gu44Oq44K544OIXG5cbiAgICAgICAgZm9yIChjb25zdCBncm91cElkIG9mIGdyb3VwSWRzKSB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCA9PT0gLTEgfHwgZ3JvdXBJZCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGdyb3VwWU1hcC5zZXQoZ3JvdXBJZCwgMCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwaGFzZSA9IGdyb3VwSWQgPT09IDAgPyAwIDogKGdyb3VwSWQgPT09IDEgPyBNYXRoLlBJIDogKGdyb3VwSWQgPT09IDIgPyBNYXRoLlBJIC8gMiA6IDApKTtcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGVkWSA9IE1hdGguc2luKHRpbWUgKiB0YXJnZXRNb3ZlbWVudFNwZWVkWSArIHBoYXNlKSAqIHRhcmdldE1vdmVtZW50U2NhbGVZO1xuICAgICAgICAgICAgZ3JvdXBZTWFwLnNldChncm91cElkLCBhbmltYXRlZFkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6Imy5aSJ5YyWXG4gICAgICAgIGNvbnN0IGNvbG9yQ2hhbmdlUGVyaW9kID0gNC4wO1xuICAgICAgICBjb25zdCB1bmlxdWVHcm91cElkcyA9IFsuLi5uZXcgU2V0KHRoaXMubGFzZXJMaW5lcy5tYXAobCA9PiBsLmdyb3VwSWQpKV07XG4gICAgICAgIGNvbnN0IG51bUdyb3VwcyA9IHVuaXF1ZUdyb3VwSWRzLmxlbmd0aDsgLy8g6Imy5aSJ5YyW44Gu44Kw44Or44O844OX5pWwXG5cbiAgICAgICAgdGhpcy5sYXNlckxpbmVzLmZvckVhY2goKGxhc2VySW5mbykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IGxhc2VySW5mby5saW5lO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IGxhc2VySW5mby5zdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVPZmZzZXQgPSBsYXNlckluZm8ucmVsYXRpdmVUYXJnZXRPZmZzZXQ7IC8vIOWbnui7ouWJjeOBruebuOWvvuOCquODleOCu+ODg+ODiFxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFRhcmdldE9mZnNldFggPSBsYXNlckluZm8uaW5pdGlhbFRhcmdldE9mZnNldDtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwSWQgPSBsYXNlckluZm8uZ3JvdXBJZDtcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbGFzZXJJbmZvLnJvdGF0aW9uOyAvLyDjg6zjg7zjgrbjg7znvqTjga7lm57ou6Lop5LluqZcblxuXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSAobGluZS5nZW9tZXRyeSBhcyBUSFJFRS5CdWZmZXJHZW9tZXRyeSkuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheSBhcyBGbG9hdDMyQXJyYXk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IHN0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WSA9IHN0YXJ0UG9zaXRpb24ueTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WiA9IHN0YXJ0UG9zaXRpb24uejtcblxuICAgICAgICAgICAgLy8g44Kw44Or44O844OXSUTjgavntJDjgaXjgY9Z6Lu444Kq44OV44K744OD44OI44KS5Y+W5b6XXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRZID0gZ3JvdXBZTWFwLmdldChncm91cElkKSA/PyAwO1xuXG4gICAgICAgICAgICAvLyDntYLngrnluqfmqJnjga7oqIjnrpfjgavlm57ou6LjgpLpgannlKhcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0ZWRSZWxhdGl2ZU9mZnNldCA9IHJlbGF0aXZlT2Zmc2V0LmNsb25lKCkuYXBwbHlBeGlzQW5nbGUobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMSksIHJvdGF0aW9uXG4pO1xuXG4gICAgICAgICAgICAvLyDkvY3nva7mm7TmlrBcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEJhc2VXb3JsZFggPSBzdGFydFBvc2l0aW9uLnggKyByb3RhdGVkUmVsYXRpdmVPZmZzZXQueDtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEJhc2VXb3JsZFkgPSBzdGFydFBvc2l0aW9uLnkgKyByb3RhdGVkUmVsYXRpdmVPZmZzZXQueSArIG9mZnNldFk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRCYXNlV29ybGRaID0gc3RhcnRQb3NpdGlvbi56ICsgcm90YXRlZFJlbGF0aXZlT2Zmc2V0Lno7XG5cbiAgICAgICAgICAgIC8vIFjou7jjga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7NcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE1vdmVtZW50U2NhbGVYID0gMS41O1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TW92ZW1lbnRTcGVlZFggPSAwLjg7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRlZFRhcmdldFggPSB0YXJnZXRCYXNlV29ybGRYICsgTWF0aC5zaW4odGltZSAqIHRhcmdldE1vdmVtZW50U3BlZWRYICsgaW5pdGlhbFRhcmdldE9mZnNldFgpICogdGFyZ2V0TW92ZW1lbnRTY2FsZVg7XG5cbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGVkVGFyZ2V0WSA9IHRhcmdldEJhc2VXb3JsZFk7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRlZFRhcmdldFogPSB0YXJnZXRCYXNlV29ybGRaO1xuXG4gICAgICAgICAgICBwb3NpdGlvbnMuc2V0KFtcbiAgICAgICAgICAgICAgICBzdGFydFgsIHN0YXJ0WSwgc3RhcnRaLFxuICAgICAgICAgICAgICAgIGFuaW1hdGVkVGFyZ2V0WCwgYW5pbWF0ZWRUYXJnZXRZLCBhbmltYXRlZFRhcmdldFosXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIChsaW5lLmdlb21ldHJ5IGFzIFRIUkVFLkJ1ZmZlckdlb21ldHJ5KS5hdHRyaWJ1dGVzLnBvc2l0aW9uLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8g6Imy44Gu5ZGo5pyf5aSJ5YyWXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCAhPT0gMikgeyAvLyBncm91cElkPTIg5Lul5aSW44Gu44Os44O844K244O844Gu6Imy44KS5ZGo5pyf5aSJ5YyWXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBJbmRleCA9IHVuaXF1ZUdyb3VwSWRzLmluZGV4T2YobGFzZXJJbmZvLmdyb3VwSWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGh1ZUJhc2UgPSBncm91cEluZGV4IC8gbnVtR3JvdXBzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGh1ZSA9IChodWVCYXNlICsgKHRpbWUgLyBjb2xvckNoYW5nZVBlcmlvZCkpICUgMS4wO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKCk7XG4gICAgICAgICAgICAgICAgY29sb3Iuc2V0SFNMKGh1ZSwgMS4wLCAwLjUpO1xuICAgICAgICAgICAgICAgIChsaW5lLm1hdGVyaWFsIGFzIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIChsaW5lLm1hdGVyaWFsIGFzIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBncm91cElkPTLjga/ngrnmu4VcbiAgICAgICAgICAgIGNvbnN0IGZsYXNoVmFsdWUgPSAoTWF0aC5zaW4odGltZSAqIHRoaXMuRkxBU0hfU1BFRUQpICsgMSkgLyAyOyAvLyAw44GL44KJMeOBruevhOWbsuOBp+WkieWMluOBmeOCi+WApFxuICAgICAgICAgICAgY29uc3QgY3VycmVudE9wYWNpdHkgPSB0aGlzLkZMQVNIX01JTl9PUEFDSVRZICsgZmxhc2hWYWx1ZSAqICh0aGlzLkZMQVNIX01BWF9PUEFDSVRZIC0gdGhpcy5GTEFTSF9NSU5fT1BBQ0lUWSk7XG4gICAgICAgICAgICAobGluZS5tYXRlcmlhbCBhcyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCkub3BhY2l0eSA9IGN1cnJlbnRPcGFjaXR5O1xuICAgICAgICAgICAgKGxpbmUubWF0ZXJpYWwgYXMgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwpLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcHVibGljIHRvZ2dsZUxhc2VyQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmlzTGFzZXJBbmltYXRpb25QYXVzZWQgPSAhdGhpcy5pc0xhc2VyQW5pbWF0aW9uUGF1c2VkO1xuICAgICAgICBjb25zb2xlLmxvZyhgTGFzZXIgYW5pbWF0aW9uIHBhdXNlZDogJHt0aGlzLmlzTGFzZXJBbmltYXRpb25QYXVzZWR9YCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE9yYml0Q29udHJvbHMgPSAoKTogT3JiaXRDb250cm9scyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yYml0Q29udHJvbHM7XG4gICAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmxldCBteVRocmVlSlNDb250YWluZXI6IFRocmVlSlNDb250YWluZXI7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbXlUaHJlZUpTQ29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcbiAgICBsZXQgdmlld3BvcnQgPSBteVRocmVlSlNDb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00od2luZG93LmlubmVyV2lkdGggKiAwLjgsIHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgNSwgMTIpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcblxuICAgIGNvbnNvbGUubG9nKFwiVG8gdG9nZ2xlIGxhc2VyIGFuaW1hdGlvbiwgY2FsbDogbXlUaHJlZUpTQ29udGFpbmVyLnRvZ2dsZUxhc2VyQW5pbWF0aW9uKClcIik7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qcy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXMtNDc2Nzg4XCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9