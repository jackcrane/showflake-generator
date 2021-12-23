(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.SnowflakeGenerator = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var Bounds = /** @class */ (function () {
            function Bounds() {
              this.x = {
                max: 0,
                min: Number.MAX_VALUE,
              };
              this.y = {
                max: 0,
                min: Number.MAX_VALUE,
              };
            }
            Bounds.prototype.addPointToBounds = function (x, y) {
              if (x < this.x.min) {
                this.x.min = x;
              }
              if (y < this.y.min) {
                this.y.min = y;
              }
              if (x > this.x.max) {
                this.x.max = x;
              }
              if (y > this.y.max) {
                this.y.max = y;
              }
            };
            Bounds.prototype.addLengthToStart = function (
              horizontalLength,
              verticalLength
            ) {
              this.x.min -= horizontalLength;
              this.y.min -= verticalLength;
            };
            Bounds.prototype.addLengthToEnd = function (
              horizontalLength,
              verticalLength
            ) {
              this.x.max += horizontalLength;
              this.y.max += verticalLength;
            };
            Bounds.prototype.addLengthToCenter = function (
              horizontalLength,
              verticalLength
            ) {
              this.addLengthToStart(horizontalLength / 2, verticalLength / 2);
              this.addLengthToEnd(horizontalLength / 2, verticalLength / 2);
            };
            Bounds.prototype.width = function () {
              return this.x.max - this.x.min;
            };
            Bounds.prototype.height = function () {
              return this.y.max - this.y.min;
            };
            Bounds.prototype.centerX = function () {
              return this.x.min + this.width();
            };
            Bounds.prototype.centerY = function () {
              return this.y.min + this.height();
            };
            return Bounds;
          })();
          exports.Bounds = Bounds;
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var snowflake_generator_1 = require("./snowflake-generator");
          function generate(particleDistance) {
            if (particleDistance === void 0) {
              particleDistance = 500;
            }
            return snowflake_generator_1.SnowflakeGenerator.generate(
              particleDistance
            );
          }
          exports.generate = generate;
          function create(particleDistance) {
            if (particleDistance === void 0) {
              particleDistance = 500;
            }
            return snowflake_generator_1.SnowflakeGenerator.create(
              particleDistance
            );
          }
          exports.create = create;
        },
        { "./snowflake-generator": 8 },
      ],
      3: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var ParticleTreeNode = /** @class */ (function () {
            function ParticleTreeNode(value, parent) {
              this.value = value;
              this.parent = parent;
              this.children = [];
            }
            ParticleTreeNode.prototype.addChild = function (node) {
              this.children.push(node);
            };
            ParticleTreeNode.prototype.closestNodeForParticle = function (
              particle,
              previousBest
            ) {
              var distance = particle.pos.distance(this.value.pos);
              var bestDistance = distance;
              var bestNode = this;
              if (previousBest) {
                var previousBestDistance = particle.pos.distance(
                  previousBest.value.pos
                );
                if (previousBestDistance < distance) {
                  bestDistance = previousBestDistance;
                  bestNode = previousBest;
                }
              }
              this.children.forEach(function (child) {
                var bestChild = child.closestNodeForParticle(
                  particle,
                  bestNode
                );
                if (bestChild) {
                  var bestChildDistance = particle.pos.distance(
                    bestChild.value.pos
                  );
                  if (bestChildDistance < bestDistance) {
                    bestNode = bestChild;
                    bestDistance = bestChildDistance;
                  }
                }
              });
              return bestNode;
            };
            ParticleTreeNode.prototype.depth = function () {
              var depth = 1;
              var maxChildDepth = 0;
              this.children.forEach(function (child) {
                maxChildDepth = Math.max(maxChildDepth, child.depth());
              });
              depth += maxChildDepth;
              return depth;
            };
            ParticleTreeNode.prototype.countChildren = function () {
              var count = 0;
              this.children.forEach(function (child) {
                return (count += child.countChildren());
              });
              return count;
            };
            return ParticleTreeNode;
          })();
          exports.ParticleTreeNode = ParticleTreeNode;
        },
        {},
      ],
      4: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var ParticleTree = /** @class */ (function () {
            function ParticleTree(root) {
              this.root = root;
              this.root = root;
            }
            ParticleTree.prototype.depth = function () {
              return this.root.depth();
            };
            ParticleTree.prototype.countChildren = function () {
              return this.root.countChildren();
            };
            return ParticleTree;
          })();
          exports.ParticleTree = ParticleTree;
        },
        {},
      ],
      5: [
        function (require, module, exports) {
          "use strict";
          // Snowflake particle class. Original code from :
          //
          // Coding Challenge 127: Brownian Motion Snowflake
          // Daniel Shiffman
          // https://thecodingtrain.com/CodingChallenges/127-brownian-snowflake.html
          // https://youtu.be/XUA8UREROYE
          Object.defineProperty(exports, "__esModule", { value: true });
          var Victor = require("victor");
          var Particle = /** @class */ (function () {
            function Particle(xPos, angle, r) {
              if (angle === void 0) {
                angle = 0;
              }
              if (r === void 0) {
                r = 2;
              }
              this.xPos = xPos;
              this.angle = angle;
              this.r = r;
              this.pos = new Victor(
                xPos,
                Particle.randomInRange(-5, 5)
              ).rotateBy(angle);
            }
            Particle.randomInRange = function (min, max) {
              var diff = max - min;
              return min + Math.random() * diff;
            };
            Particle.prototype.update = function () {
              this.pos.x -= Particle.randomInRange(0, 1);
              this.pos.y += Particle.randomInRange(-5, 5);
              var angle = this.pos.horizontalAngle();
              angle = Math.min(Math.max(0, angle), Math.PI / 8);
              var magnitude = this.pos.length();
              this.pos = new Victor(magnitude, 0).rotateBy(angle);
            };
            Particle.prototype.intersects = function (snowflake) {
              var result = false;
              for (
                var _i = 0, snowflake_1 = snowflake;
                _i < snowflake_1.length;
                _i++
              ) {
                var s = snowflake_1[_i];
                var d = this.pos.distance(s.pos);
                if (d < this.r * 2) {
                  result = true;
                  break;
                }
              }
              return result;
            };
            Particle.prototype.finished = function () {
              return this.pos.x < 1;
            };
            return Particle;
          })();
          exports.Particle = Particle;
        },
        { victor: 10 },
      ],
      6: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var snowflake_1 = require("./snowflake");
          var SnowflakeGenerator = /** @class */ (function () {
            function SnowflakeGenerator() {}
            /**
             * Generates a new completed snowflake
             * @param particleDistance
             * @returns A new completed snowflake
             */
            SnowflakeGenerator.generate = function (particleDistance) {
              var snowflake = SnowflakeGenerator.create(particleDistance);
              snowflake.generate();
              return snowflake;
            };
            SnowflakeGenerator.create = function (particleDistance) {
              var snowflake = new snowflake_1.Snowflake(particleDistance);
              return snowflake;
            };
            return SnowflakeGenerator;
          })();
          exports.SnowflakeGenerator = SnowflakeGenerator;
        },
        { "./snowflake": 8 },
      ],
      7: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var bounds_1 = require("./bounds");
          var view_element_1 = require("./view-element");
          var SnowflakeView = /** @class */ (function () {
            function SnowflakeView() {}
            /**
             * Generates an SVG path representation of the particles composing the snowflake.
             * @param size The width and height of the svg output
             */
            SnowflakeView.toSVGPath = function (snowflake, size) {
              var tree = snowflake.getParticleTree();
              var strokeWidth = tree.root.value.r * 0.9;
              var path = new view_element_1.ViewElement(
                "path",
                "http://www.w3.org/2000/svg"
              );
              path.setAttribute("stroke", "black");
              path.setAttribute("stroke-width", strokeWidth.toString());
              path.setAttribute("stroke-linecap", "round");
              path.setAttribute("stroke-linejoin", "round");
              path.setAttribute("fill", "none");
              path.setAttribute(
                "d",
                "M 0 0" + SnowflakeView.generateSVGNodePath(tree.root)
              );
              var bounds = SnowflakeView.getParticlesBounds(snowflake);
              bounds.addLengthToCenter(
                strokeWidth * 2 * 1.2,
                strokeWidth * 2 * 1.2
              );
              var svg = SnowflakeView.generateSVGMarkup(path, bounds);
              if (size) {
                svg.setAttribute("width", size.toString());
                svg.setAttribute("height", size.toString());
              }
              return svg;
            };
            /**
             * Generates an SVG dots representation of the particles composing the snowflake.
             * @param size The width and height of the svg output
             */
            SnowflakeView.toSVGDots = function (snowflake, size) {
              var tree = snowflake.getParticleTree();
              var dotRadius = tree.root.value.r * 0.9;
              var g = new view_element_1.ViewElement(
                "g",
                "http://www.w3.org/2000/svg"
              );
              SnowflakeView.generateSVGNodeDots(tree.root, dotRadius).forEach(
                function (dot) {
                  return g.appendChild(dot);
                }
              );
              var bounds = SnowflakeView.getParticlesBounds(snowflake);
              bounds.addLengthToCenter(dotRadius * 2, dotRadius * 2);
              var svg = SnowflakeView.generateSVGMarkup(g, bounds);
              if (size) {
                svg.setAttribute("width", size.toString());
                svg.setAttribute("height", size.toString());
              }
              return svg;
            };
            SnowflakeView.getParticlesBounds = function (snowflake) {
              var bounds = new bounds_1.Bounds();
              snowflake.getParticles().forEach(function (particle) {
                bounds.addPointToBounds(particle.pos.x, particle.pos.y);
              });
              return bounds;
            };
            SnowflakeView.generateSVGMarkup = function (
              halfBranchElement,
              bounds
            ) {
              var svgNS = "http://www.w3.org/2000/svg";
              var xlinkNS = "http://www.w3.org/1999/xlink";
              var svg = new view_element_1.ViewElement("svg", svgNS);
              var defs = new view_element_1.ViewElement("defs", svgNS);
              var viewBoxWidth = bounds.width() * 2;
              var viewBoxHeight = bounds.width() * 2;
              var viewBoxX = -bounds.width();
              var viewBoxY = -bounds.width();
              var flakeHalfBranchId = "flake-half-branch-" + this.uuidv4();
              var flakeBranchId = "flake-branch-" + this.uuidv4();
              svg.setAttribute("xmlns", svgNS);
              svg.setAttribute("xmlns:xlink", xlinkNS);
              svg.setAttribute("version", "1.1");
              svg.setAttribute("preserveAspectRatio", "xMinYMax meet");
              svg.setAttribute(
                "viewBox",
                viewBoxX +
                  " " +
                  viewBoxY +
                  " " +
                  viewBoxWidth +
                  " " +
                  viewBoxHeight
              );
              halfBranchElement.setAttribute("id", flakeHalfBranchId);
              defs.appendChild(halfBranchElement);
              svg.appendChild(defs);
              var branchGroup = new view_element_1.ViewElement("g", svgNS);
              branchGroup.setAttribute("id", flakeBranchId);
              var useFlakeHalfBranch = new view_element_1.ViewElement(
                "use",
                svgNS
              );
              useFlakeHalfBranch.setAttributeNS(
                xlinkNS,
                "xlink:href",
                "#" + flakeHalfBranchId
              );
              useFlakeHalfBranch.setAttribute("x", "0");
              useFlakeHalfBranch.setAttribute("y", "0");
              branchGroup.appendChild(useFlakeHalfBranch);
              var useFlakeHalfBranchSymetry = new view_element_1.ViewElement(
                "use",
                svgNS
              );
              useFlakeHalfBranchSymetry.setAttributeNS(
                xlinkNS,
                "xlink:href",
                "#" + flakeHalfBranchId
              );
              useFlakeHalfBranchSymetry.setAttribute("x", "0");
              useFlakeHalfBranchSymetry.setAttribute("y", "0");
              useFlakeHalfBranchSymetry.setAttribute(
                "transform",
                "scale(1 -1)"
              );
              branchGroup.appendChild(useFlakeHalfBranchSymetry);
              defs.appendChild(branchGroup);
              var angle = 360 / 8;
              for (var i = 0; i < 8; i++) {
                var useFlakeBranch = new view_element_1.ViewElement(
                  "use",
                  svgNS
                );
                useFlakeBranch.setAttributeNS(
                  xlinkNS,
                  "xlink:href",
                  "#" + flakeBranchId
                );
                useFlakeBranch.setAttribute("x", "0");
                useFlakeBranch.setAttribute("y", "0");
                useFlakeBranch.setAttribute(
                  "transform",
                  "rotate(" + i * angle + ")"
                );
                useFlakeBranch.setAttribute("class", "flake-branch");
                svg.appendChild(useFlakeBranch);
              }
              return svg;
            };
            SnowflakeView.generateSVGNodePath = function (node) {
              var _this = this;
              var path = "";
              var xOffset = 0;
              var yOffset = 0;
              path +=
                " L " +
                (node.value.pos.x - xOffset) +
                " " +
                (node.value.pos.y - yOffset);
              if (node.children.length === 0) {
                path +=
                  " L " +
                  (node.value.pos.x + xOffset) +
                  " " +
                  (node.value.pos.y - yOffset);
                path +=
                  " L " +
                  (node.value.pos.x + xOffset) +
                  " " +
                  (node.value.pos.y + yOffset);
              } else {
                node.children.forEach(function (child) {
                  path +=
                    " L " +
                    (node.value.pos.x + xOffset) +
                    " " +
                    (node.value.pos.y - yOffset);
                  path += _this.generateSVGNodePath(child);
                  path +=
                    " L " +
                    (node.value.pos.x + xOffset) +
                    " " +
                    (node.value.pos.y + yOffset);
                });
              }
              path +=
                " L " +
                (node.value.pos.x - xOffset) +
                " " +
                (node.value.pos.y + yOffset);
              return path;
            };
            SnowflakeView.generateSVGNodeDots = function (node, dotRadius) {
              var _this = this;
              var svgNS = "http://www.w3.org/2000/svg";
              var dots = [];
              var dot = new view_element_1.ViewElement("circle", svgNS);
              dot.setAttribute("cx", node.value.pos.x);
              dot.setAttribute("cy", node.value.pos.y);
              dot.setAttribute("r", dotRadius.toString());
              dots.push(dot);
              node.children.forEach(function (child) {
                _this
                  .generateSVGNodeDots(child, dotRadius)
                  .forEach(function (childDot) {
                    return dots.push(childDot);
                  });
              });
              return dots;
            };
            SnowflakeView.uuidv4 = function () {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                  var r = (Math.random() * 16) | 0;
                  var v = c === "x" ? r : (r & 0x3) | 0x8;
                  return v.toString(16);
                }
              );
            };
            return SnowflakeView;
          })();
          exports.SnowflakeView = SnowflakeView;
        },
        { "./bounds": 1, "./view-element": 9 },
      ],
      8: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var particle_1 = require("./particle");
          var particle_tree_1 = require("./particle-tree");
          var particle_tree_node_1 = require("./particle-tree-node");
          var snowflake_view_1 = require("./snowflake-view");
          var Snowflake = /** @class */ (function () {
            /**
             * Creates a new snowflake to be generated with 1 particle.
             * @param distance The distance at witch particles will start to get to the snowflake
             */
            function Snowflake(distance) {
              if (distance === void 0) {
                distance = 500;
              }
              this.distance = distance;
              this.particles = [];
              this.done = false;
              this.addParticle();
            }
            /**
             * Indicates if the snowflake is completed
             */
            Snowflake.prototype.isDone = function () {
              return this.done;
            };
            /**
             * Generate the snowflake by using `addParticle()` until `isDone()`.
             */
            Snowflake.prototype.generate = function () {
              while (!this.done) {
                var count = this.addParticle();
                if (count === 0) {
                  this.done = true;
                }
              }
            };
            /**
             * Adds a patricle to the snowflake.
             * @returns The number of moves needed to make the particle meet the snowflake or -1 if
             * the snowflake is already completed
             */
            Snowflake.prototype.addParticle = function () {
              if (!this.done) {
                var currentParticle = new particle_1.Particle(this.distance);
                var count = 0;
                while (
                  !currentParticle.finished() &&
                  !currentParticle.intersects(this.particles)
                ) {
                  currentParticle.update();
                  count++;
                }
                this.particles.push(currentParticle);
                return count;
              } else {
                return -1;
              }
            };
            /**
             * Returns the particle array.
             */
            Snowflake.prototype.getParticles = function () {
              return this.particles;
            };
            /**
             * Generates an SVG path representation of the particles composing the snowflake.
             * @param size The width and height of the svg output
             */
            Snowflake.prototype.toSVG = function (size) {
              if (size === void 0) {
                size = 100;
              }
              return this.toSVGPath(size);
            };
            /**
             * Generates an SVG path representation of the particles composing the snowflake.
             * @param size The width and height of the svg output
             */
            Snowflake.prototype.toSVGPath = function (size) {
              return snowflake_view_1.SnowflakeView.toSVGPath(this, size);
            };
            /**
             * Generates an SVG dots representation of the particles composing the snowflake.
             * @param size The width and height of the svg output
             */
            Snowflake.prototype.toSVGDots = function (size) {
              return snowflake_view_1.SnowflakeView.toSVGDots(this, size);
            };
            Snowflake.prototype.getParticleTree = function () {
              var currentNode = new particle_tree_node_1.ParticleTreeNode(
                this.particles[0]
              );
              var tree = new particle_tree_1.ParticleTree(currentNode);
              if (this.particles.length === 1) {
                return tree;
              }
              for (var i = 1; i < this.particles.length; i++) {
                var particle = this.particles[i];
                var bestParent = tree.root.closestNodeForParticle(particle);
                currentNode = new particle_tree_node_1.ParticleTreeNode(
                  particle,
                  bestParent
                );
                bestParent.addChild(currentNode);
              }
              return tree;
            };
            return Snowflake;
          })();
          exports.Snowflake = Snowflake;
        },
        {
          "./particle": 5,
          "./particle-tree": 4,
          "./particle-tree-node": 3,
          "./snowflake-view": 7,
        },
      ],
      9: [
        function (require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var ViewElement = /** @class */ (function () {
            function ViewElement(name, namespace) {
              if (namespace === void 0) {
                namespace = null;
              }
              this.name = name;
              this.namespace = namespace;
              this.children = [];
              this.attributes = {};
            }
            ViewElement.prototype.appendChild = function (child) {
              this.children.push(child);
            };
            ViewElement.prototype.setAttributeNS = function (
              namespace,
              key,
              value
            ) {
              var namespaceKey =
                namespace != null ? namespace : ViewElement.NO_NAMESPACE;
              var attributesNS = this.attributes[namespaceKey];
              if (attributesNS === undefined) {
                attributesNS = {};
              }
              attributesNS[key] = value;
              this.attributes[namespaceKey] = attributesNS;
            };
            ViewElement.prototype.setAttribute = function (key, value) {
              this.setAttributeNS(null, key, value);
            };
            ViewElement.prototype.toDomElement = function () {
              var _this = this;
              var rootElement = document.createElementNS(
                this.namespace,
                this.name
              );
              var attributeNamespaceKeys = Object.keys(this.attributes);
              if (attributeNamespaceKeys.length > 0) {
                attributeNamespaceKeys.forEach(function (namespace) {
                  var attributeKeys = Object.keys(_this.attributes[namespace]);
                  attributeKeys.forEach(function (key) {
                    if (namespace === ViewElement.NO_NAMESPACE) {
                      rootElement.setAttribute(
                        key,
                        _this.attributes[namespace][key]
                      );
                    } else {
                      rootElement.setAttributeNS(
                        namespace,
                        key,
                        _this.attributes[namespace][key]
                      );
                    }
                  });
                });
              }
              this.children.forEach(function (child) {
                return rootElement.appendChild(child.toDomElement());
              });
              return rootElement;
            };
            ViewElement.prototype.toString = function () {
              var _this = this;
              var output = "<" + this.name;
              var attributeNamespaceKeys = Object.keys(this.attributes);
              if (attributeNamespaceKeys.length > 0) {
                attributeNamespaceKeys.forEach(function (namespace) {
                  var attributeKeys = Object.keys(_this.attributes[namespace]);
                  attributeKeys.forEach(function (key) {
                    return (output +=
                      " " +
                      key +
                      '="' +
                      _this.attributes[namespace][key] +
                      '"');
                  });
                });
              }
              if (this.children.length > 0) {
                output += ">";
                output += this.children
                  .map(function (child) {
                    return child.toString();
                  })
                  .join();
                output += "</" + this.name + ">";
              } else {
                output += "/>";
              }
              return output;
            };
            ViewElement.NO_NAMESPACE = "__nonamespaces__";
            return ViewElement;
          })();
          exports.ViewElement = ViewElement;
        },
        {},
      ],
      10: [
        function (require, module, exports) {
          exports = module.exports = Victor;

          /**
           * # Victor - A JavaScript 2D vector class with methods for common vector operations
           */

          /**
           * Constructor. Will also work without the `new` keyword
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = Victor(42, 1337);
           *
           * @param {Number} x Value of the x axis
           * @param {Number} y Value of the y axis
           * @return {Victor}
           * @api public
           */
          function Victor(x, y) {
            if (!(this instanceof Victor)) {
              return new Victor(x, y);
            }

            /**
             * The X axis
             *
             * ### Examples:
             *     var vec = new Victor.fromArray(42, 21);
             *
             *     vec.x;
             *     // => 42
             *
             * @api public
             */
            this.x = x || 0;

            /**
             * The Y axis
             *
             * ### Examples:
             *     var vec = new Victor.fromArray(42, 21);
             *
             *     vec.y;
             *     // => 21
             *
             * @api public
             */
            this.y = y || 0;
          }

          /**
           * # Static
           */

          /**
           * Creates a new instance from an array
           *
           * ### Examples:
           *     var vec = Victor.fromArray([42, 21]);
           *
           *     vec.toString();
           *     // => x:42, y:21
           *
           * @name Victor.fromArray
           * @param {Array} array Array with the x and y values at index 0 and 1 respectively
           * @return {Victor} The new instance
           * @api public
           */
          Victor.fromArray = function (arr) {
            return new Victor(arr[0] || 0, arr[1] || 0);
          };

          /**
           * Creates a new instance from an object
           *
           * ### Examples:
           *     var vec = Victor.fromObject({ x: 42, y: 21 });
           *
           *     vec.toString();
           *     // => x:42, y:21
           *
           * @name Victor.fromObject
           * @param {Object} obj Object with the values for x and y
           * @return {Victor} The new instance
           * @api public
           */
          Victor.fromObject = function (obj) {
            return new Victor(obj.x || 0, obj.y || 0);
          };

          /**
           * # Manipulation
           *
           * These functions are chainable.
           */

          /**
           * Adds another vector's X axis to this one
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.addX(vec2);
           *     vec1.toString();
           *     // => x:30, y:10
           *
           * @param {Victor} vector The other vector you want to add to this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.addX = function (vec) {
            this.x += vec.x;
            return this;
          };

          /**
           * Adds another vector's Y axis to this one
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.addY(vec2);
           *     vec1.toString();
           *     // => x:10, y:40
           *
           * @param {Victor} vector The other vector you want to add to this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.addY = function (vec) {
            this.y += vec.y;
            return this;
          };

          /**
           * Adds another vector to this one
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.add(vec2);
           *     vec1.toString();
           *     // => x:30, y:40
           *
           * @param {Victor} vector The other vector you want to add to this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.add = function (vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
          };

          /**
           * Adds the given scalar to both vector axis
           *
           * ### Examples:
           *     var vec = new Victor(1, 2);
           *
           *     vec.addScalar(2);
           *     vec.toString();
           *     // => x: 3, y: 4
           *
           * @param {Number} scalar The scalar to add
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.addScalar = function (scalar) {
            this.x += scalar;
            this.y += scalar;
            return this;
          };

          /**
           * Adds the given scalar to the X axis
           *
           * ### Examples:
           *     var vec = new Victor(1, 2);
           *
           *     vec.addScalarX(2);
           *     vec.toString();
           *     // => x: 3, y: 2
           *
           * @param {Number} scalar The scalar to add
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.addScalarX = function (scalar) {
            this.x += scalar;
            return this;
          };

          /**
           * Adds the given scalar to the Y axis
           *
           * ### Examples:
           *     var vec = new Victor(1, 2);
           *
           *     vec.addScalarY(2);
           *     vec.toString();
           *     // => x: 1, y: 4
           *
           * @param {Number} scalar The scalar to add
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.addScalarY = function (scalar) {
            this.y += scalar;
            return this;
          };

          /**
           * Subtracts the X axis of another vector from this one
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.subtractX(vec2);
           *     vec1.toString();
           *     // => x:80, y:50
           *
           * @param {Victor} vector The other vector you want subtract from this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtractX = function (vec) {
            this.x -= vec.x;
            return this;
          };

          /**
           * Subtracts the Y axis of another vector from this one
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.subtractY(vec2);
           *     vec1.toString();
           *     // => x:100, y:20
           *
           * @param {Victor} vector The other vector you want subtract from this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtractY = function (vec) {
            this.y -= vec.y;
            return this;
          };

          /**
           * Subtracts another vector from this one
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(20, 30);
           *
           *     vec1.subtract(vec2);
           *     vec1.toString();
           *     // => x:80, y:20
           *
           * @param {Victor} vector The other vector you want subtract from this one
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtract = function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
          };

          /**
           * Subtracts the given scalar from both axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 200);
           *
           *     vec.subtractScalar(20);
           *     vec.toString();
           *     // => x: 80, y: 180
           *
           * @param {Number} scalar The scalar to subtract
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtractScalar = function (scalar) {
            this.x -= scalar;
            this.y -= scalar;
            return this;
          };

          /**
           * Subtracts the given scalar from the X axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 200);
           *
           *     vec.subtractScalarX(20);
           *     vec.toString();
           *     // => x: 80, y: 200
           *
           * @param {Number} scalar The scalar to subtract
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtractScalarX = function (scalar) {
            this.x -= scalar;
            return this;
          };

          /**
           * Subtracts the given scalar from the Y axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 200);
           *
           *     vec.subtractScalarY(20);
           *     vec.toString();
           *     // => x: 100, y: 180
           *
           * @param {Number} scalar The scalar to subtract
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.subtractScalarY = function (scalar) {
            this.y -= scalar;
            return this;
          };

          /**
           * Divides the X axis by the x component of given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(2, 0);
           *
           *     vec.divideX(vec2);
           *     vec.toString();
           *     // => x:50, y:50
           *
           * @param {Victor} vector The other vector you want divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divideX = function (vector) {
            this.x /= vector.x;
            return this;
          };

          /**
           * Divides the Y axis by the y component of given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(0, 2);
           *
           *     vec.divideY(vec2);
           *     vec.toString();
           *     // => x:100, y:25
           *
           * @param {Victor} vector The other vector you want divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divideY = function (vector) {
            this.y /= vector.y;
            return this;
          };

          /**
           * Divides both vector axis by a axis values of given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(2, 2);
           *
           *     vec.divide(vec2);
           *     vec.toString();
           *     // => x:50, y:25
           *
           * @param {Victor} vector The vector to divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            return this;
          };

          /**
           * Divides both vector axis by the given scalar value
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.divideScalar(2);
           *     vec.toString();
           *     // => x:50, y:25
           *
           * @param {Number} The scalar to divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
              this.x /= scalar;
              this.y /= scalar;
            } else {
              this.x = 0;
              this.y = 0;
            }

            return this;
          };

          /**
           * Divides the X axis by the given scalar value
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.divideScalarX(2);
           *     vec.toString();
           *     // => x:50, y:50
           *
           * @param {Number} The scalar to divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divideScalarX = function (scalar) {
            if (scalar !== 0) {
              this.x /= scalar;
            } else {
              this.x = 0;
            }
            return this;
          };

          /**
           * Divides the Y axis by the given scalar value
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.divideScalarY(2);
           *     vec.toString();
           *     // => x:100, y:25
           *
           * @param {Number} The scalar to divide by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.divideScalarY = function (scalar) {
            if (scalar !== 0) {
              this.y /= scalar;
            } else {
              this.y = 0;
            }
            return this;
          };

          /**
           * Inverts the X axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.invertX();
           *     vec.toString();
           *     // => x:-100, y:50
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.invertX = function () {
            this.x *= -1;
            return this;
          };

          /**
           * Inverts the Y axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.invertY();
           *     vec.toString();
           *     // => x:100, y:-50
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.invertY = function () {
            this.y *= -1;
            return this;
          };

          /**
           * Inverts both axis
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.invert();
           *     vec.toString();
           *     // => x:-100, y:-50
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.invert = function () {
            this.invertX();
            this.invertY();
            return this;
          };

          /**
           * Multiplies the X axis by X component of given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(2, 0);
           *
           *     vec.multiplyX(vec2);
           *     vec.toString();
           *     // => x:200, y:50
           *
           * @param {Victor} vector The vector to multiply the axis with
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiplyX = function (vector) {
            this.x *= vector.x;
            return this;
          };

          /**
           * Multiplies the Y axis by Y component of given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(0, 2);
           *
           *     vec.multiplyX(vec2);
           *     vec.toString();
           *     // => x:100, y:100
           *
           * @param {Victor} vector The vector to multiply the axis with
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiplyY = function (vector) {
            this.y *= vector.y;
            return this;
          };

          /**
           * Multiplies both vector axis by values from a given vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     var vec2 = new Victor(2, 2);
           *
           *     vec.multiply(vec2);
           *     vec.toString();
           *     // => x:200, y:100
           *
           * @param {Victor} vector The vector to multiply by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            return this;
          };

          /**
           * Multiplies both vector axis by the given scalar value
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.multiplyScalar(2);
           *     vec.toString();
           *     // => x:200, y:100
           *
           * @param {Number} The scalar to multiply by
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
          };

          /**
           * Multiplies the X axis by the given scalar
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.multiplyScalarX(2);
           *     vec.toString();
           *     // => x:200, y:50
           *
           * @param {Number} The scalar to multiply the axis with
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiplyScalarX = function (scalar) {
            this.x *= scalar;
            return this;
          };

          /**
           * Multiplies the Y axis by the given scalar
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.multiplyScalarY(2);
           *     vec.toString();
           *     // => x:100, y:100
           *
           * @param {Number} The scalar to multiply the axis with
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.multiplyScalarY = function (scalar) {
            this.y *= scalar;
            return this;
          };

          /**
           * Normalize
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.normalize = function () {
            var length = this.length();

            if (length === 0) {
              this.x = 1;
              this.y = 0;
            } else {
              this.divide(Victor(length, length));
            }
            return this;
          };

          Victor.prototype.norm = Victor.prototype.normalize;

          /**
           * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.limit(80, 0.9);
           *     vec.toString();
           *     // => x:90, y:50
           *
           * @param {Number} max The maximum value for both x and y axis
           * @param {Number} factor Factor by which the axis are to be multiplied with
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.limit = function (max, factor) {
            if (Math.abs(this.x) > max) {
              this.x *= factor;
            }
            if (Math.abs(this.y) > max) {
              this.y *= factor;
            }
            return this;
          };

          /**
           * Randomizes both vector axis with a value between 2 vectors
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
           *     vec.toString();
           *     // => x:67, y:73
           *
           * @param {Victor} topLeft first vector
           * @param {Victor} bottomRight second vector
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.randomize = function (topLeft, bottomRight) {
            this.randomizeX(topLeft, bottomRight);
            this.randomizeY(topLeft, bottomRight);

            return this;
          };

          /**
           * Randomizes the y axis with a value between 2 vectors
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
           *     vec.toString();
           *     // => x:55, y:50
           *
           * @param {Victor} topLeft first vector
           * @param {Victor} bottomRight second vector
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.randomizeX = function (topLeft, bottomRight) {
            var min = Math.min(topLeft.x, bottomRight.x);
            var max = Math.max(topLeft.x, bottomRight.x);
            this.x = random(min, max);
            return this;
          };

          /**
           * Randomizes the y axis with a value between 2 vectors
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
           *     vec.toString();
           *     // => x:100, y:66
           *
           * @param {Victor} topLeft first vector
           * @param {Victor} bottomRight second vector
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.randomizeY = function (topLeft, bottomRight) {
            var min = Math.min(topLeft.y, bottomRight.y);
            var max = Math.max(topLeft.y, bottomRight.y);
            this.y = random(min, max);
            return this;
          };

          /**
           * Randomly randomizes either axis between 2 vectors
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
           *     vec.toString();
           *     // => x:100, y:77
           *
           * @param {Victor} topLeft first vector
           * @param {Victor} bottomRight second vector
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
            if (!!Math.round(Math.random())) {
              this.randomizeX(topLeft, bottomRight);
            } else {
              this.randomizeY(topLeft, bottomRight);
            }
            return this;
          };

          /**
           * Rounds both axis to an integer value
           *
           * ### Examples:
           *     var vec = new Victor(100.2, 50.9);
           *
           *     vec.unfloat();
           *     vec.toString();
           *     // => x:100, y:51
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.unfloat = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
          };

          /**
           * Rounds both axis to a certain precision
           *
           * ### Examples:
           *     var vec = new Victor(100.2, 50.9);
           *
           *     vec.unfloat();
           *     vec.toString();
           *     // => x:100, y:51
           *
           * @param {Number} Precision (default: 8)
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.toFixed = function (precision) {
            if (typeof precision === "undefined") {
              precision = 8;
            }
            this.x = this.x.toFixed(precision);
            this.y = this.y.toFixed(precision);
            return this;
          };

          /**
           * Performs a linear blend / interpolation of the X axis towards another vector
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 100);
           *     var vec2 = new Victor(200, 200);
           *
           *     vec1.mixX(vec2, 0.5);
           *     vec.toString();
           *     // => x:150, y:100
           *
           * @param {Victor} vector The other vector
           * @param {Number} amount The blend amount (optional, default: 0.5)
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.mixX = function (vec, amount) {
            if (typeof amount === "undefined") {
              amount = 0.5;
            }

            this.x = (1 - amount) * this.x + amount * vec.x;
            return this;
          };

          /**
           * Performs a linear blend / interpolation of the Y axis towards another vector
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 100);
           *     var vec2 = new Victor(200, 200);
           *
           *     vec1.mixY(vec2, 0.5);
           *     vec.toString();
           *     // => x:100, y:150
           *
           * @param {Victor} vector The other vector
           * @param {Number} amount The blend amount (optional, default: 0.5)
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.mixY = function (vec, amount) {
            if (typeof amount === "undefined") {
              amount = 0.5;
            }

            this.y = (1 - amount) * this.y + amount * vec.y;
            return this;
          };

          /**
           * Performs a linear blend / interpolation towards another vector
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 100);
           *     var vec2 = new Victor(200, 200);
           *
           *     vec1.mix(vec2, 0.5);
           *     vec.toString();
           *     // => x:150, y:150
           *
           * @param {Victor} vector The other vector
           * @param {Number} amount The blend amount (optional, default: 0.5)
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.mix = function (vec, amount) {
            this.mixX(vec, amount);
            this.mixY(vec, amount);
            return this;
          };

          /**
           * # Products
           */

          /**
           * Creates a clone of this vector
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = vec1.clone();
           *
           *     vec2.toString();
           *     // => x:10, y:10
           *
           * @return {Victor} A clone of the vector
           * @api public
           */
          Victor.prototype.clone = function () {
            return new Victor(this.x, this.y);
          };

          /**
           * Copies another vector's X component in to its own
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 20);
           *     var vec2 = vec1.copyX(vec1);
           *
           *     vec2.toString();
           *     // => x:20, y:10
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.copyX = function (vec) {
            this.x = vec.x;
            return this;
          };

          /**
           * Copies another vector's Y component in to its own
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 20);
           *     var vec2 = vec1.copyY(vec1);
           *
           *     vec2.toString();
           *     // => x:10, y:20
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.copyY = function (vec) {
            this.y = vec.y;
            return this;
          };

          /**
           * Copies another vector's X and Y components in to its own
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *     var vec2 = new Victor(20, 20);
           *     var vec2 = vec1.copy(vec1);
           *
           *     vec2.toString();
           *     // => x:20, y:20
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.copy = function (vec) {
            this.copyX(vec);
            this.copyY(vec);
            return this;
          };

          /**
           * Sets the vector to zero (0,0)
           *
           * ### Examples:
           *     var vec1 = new Victor(10, 10);
           *		 var1.zero();
           *     vec1.toString();
           *     // => x:0, y:0
           *
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.zero = function () {
            this.x = this.y = 0;
            return this;
          };

          /**
           * Calculates the dot product of this vector and another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.dot(vec2);
           *     // => 23000
           *
           * @param {Victor} vector The second vector
           * @return {Number} Dot product
           * @api public
           */
          Victor.prototype.dot = function (vec2) {
            return this.x * vec2.x + this.y * vec2.y;
          };

          Victor.prototype.cross = function (vec2) {
            return this.x * vec2.y - this.y * vec2.x;
          };

          /**
           * Projects a vector onto another vector, setting itself to the result.
           *
           * ### Examples:
           *     var vec = new Victor(100, 0);
           *     var vec2 = new Victor(100, 100);
           *
           *     vec.projectOnto(vec2);
           *     vec.toString();
           *     // => x:50, y:50
           *
           * @param {Victor} vector The other vector you want to project this vector onto
           * @return {Victor} `this` for chaining capabilities
           * @api public
           */
          Victor.prototype.projectOnto = function (vec2) {
            var coeff =
              (this.x * vec2.x + this.y * vec2.y) /
              (vec2.x * vec2.x + vec2.y * vec2.y);
            this.x = coeff * vec2.x;
            this.y = coeff * vec2.y;
            return this;
          };

          Victor.prototype.horizontalAngle = function () {
            return Math.atan2(this.y, this.x);
          };

          Victor.prototype.horizontalAngleDeg = function () {
            return radian2degrees(this.horizontalAngle());
          };

          Victor.prototype.verticalAngle = function () {
            return Math.atan2(this.x, this.y);
          };

          Victor.prototype.verticalAngleDeg = function () {
            return radian2degrees(this.verticalAngle());
          };

          Victor.prototype.angle = Victor.prototype.horizontalAngle;
          Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
          Victor.prototype.direction = Victor.prototype.horizontalAngle;

          Victor.prototype.rotate = function (angle) {
            var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
            var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);

            this.x = nx;
            this.y = ny;

            return this;
          };

          Victor.prototype.rotateDeg = function (angle) {
            angle = degrees2radian(angle);
            return this.rotate(angle);
          };

          Victor.prototype.rotateTo = function (rotation) {
            return this.rotate(rotation - this.angle());
          };

          Victor.prototype.rotateToDeg = function (rotation) {
            rotation = degrees2radian(rotation);
            return this.rotateTo(rotation);
          };

          Victor.prototype.rotateBy = function (rotation) {
            var angle = this.angle() + rotation;

            return this.rotate(angle);
          };

          Victor.prototype.rotateByDeg = function (rotation) {
            rotation = degrees2radian(rotation);
            return this.rotateBy(rotation);
          };

          /**
           * Calculates the distance of the X axis between this vector and another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.distanceX(vec2);
           *     // => -100
           *
           * @param {Victor} vector The second vector
           * @return {Number} Distance
           * @api public
           */
          Victor.prototype.distanceX = function (vec) {
            return this.x - vec.x;
          };

          /**
           * Same as `distanceX()` but always returns an absolute number
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.absDistanceX(vec2);
           *     // => 100
           *
           * @param {Victor} vector The second vector
           * @return {Number} Absolute distance
           * @api public
           */
          Victor.prototype.absDistanceX = function (vec) {
            return Math.abs(this.distanceX(vec));
          };

          /**
           * Calculates the distance of the Y axis between this vector and another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.distanceY(vec2);
           *     // => -10
           *
           * @param {Victor} vector The second vector
           * @return {Number} Distance
           * @api public
           */
          Victor.prototype.distanceY = function (vec) {
            return this.y - vec.y;
          };

          /**
           * Same as `distanceY()` but always returns an absolute number
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.distanceY(vec2);
           *     // => 10
           *
           * @param {Victor} vector The second vector
           * @return {Number} Absolute distance
           * @api public
           */
          Victor.prototype.absDistanceY = function (vec) {
            return Math.abs(this.distanceY(vec));
          };

          /**
           * Calculates the euclidean distance between this vector and another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.distance(vec2);
           *     // => 100.4987562112089
           *
           * @param {Victor} vector The second vector
           * @return {Number} Distance
           * @api public
           */
          Victor.prototype.distance = function (vec) {
            return Math.sqrt(this.distanceSq(vec));
          };

          /**
           * Calculates the squared euclidean distance between this vector and another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(200, 60);
           *
           *     vec1.distanceSq(vec2);
           *     // => 10100
           *
           * @param {Victor} vector The second vector
           * @return {Number} Distance
           * @api public
           */
          Victor.prototype.distanceSq = function (vec) {
            var dx = this.distanceX(vec),
              dy = this.distanceY(vec);

            return dx * dx + dy * dy;
          };

          /**
           * Calculates the length or magnitude of the vector
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.length();
           *     // => 111.80339887498948
           *
           * @return {Number} Length / Magnitude
           * @api public
           */
          Victor.prototype.length = function () {
            return Math.sqrt(this.lengthSq());
          };

          /**
           * Squared length / magnitude
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *
           *     vec.lengthSq();
           *     // => 12500
           *
           * @return {Number} Length / Magnitude
           * @api public
           */
          Victor.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y;
          };

          Victor.prototype.magnitude = Victor.prototype.length;

          /**
           * Returns a true if vector is (0, 0)
           *
           * ### Examples:
           *     var vec = new Victor(100, 50);
           *     vec.zero();
           *
           *     // => true
           *
           * @return {Boolean}
           * @api public
           */
          Victor.prototype.isZero = function () {
            return this.x === 0 && this.y === 0;
          };

          /**
           * Returns a true if this vector is the same as another
           *
           * ### Examples:
           *     var vec1 = new Victor(100, 50);
           *     var vec2 = new Victor(100, 50);
           *     vec1.isEqualTo(vec2);
           *
           *     // => true
           *
           * @return {Boolean}
           * @api public
           */
          Victor.prototype.isEqualTo = function (vec2) {
            return this.x === vec2.x && this.y === vec2.y;
          };

          /**
           * # Utility Methods
           */

          /**
           * Returns an string representation of the vector
           *
           * ### Examples:
           *     var vec = new Victor(10, 20);
           *
           *     vec.toString();
           *     // => x:10, y:20
           *
           * @return {String}
           * @api public
           */
          Victor.prototype.toString = function () {
            return "x:" + this.x + ", y:" + this.y;
          };

          /**
           * Returns an array representation of the vector
           *
           * ### Examples:
           *     var vec = new Victor(10, 20);
           *
           *     vec.toArray();
           *     // => [10, 20]
           *
           * @return {Array}
           * @api public
           */
          Victor.prototype.toArray = function () {
            return [this.x, this.y];
          };

          /**
           * Returns an object representation of the vector
           *
           * ### Examples:
           *     var vec = new Victor(10, 20);
           *
           *     vec.toObject();
           *     // => { x: 10, y: 20 }
           *
           * @return {Object}
           * @api public
           */
          Victor.prototype.toObject = function () {
            return { x: this.x, y: this.y };
          };

          var degrees = 180 / Math.PI;

          function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
          }

          function radian2degrees(rad) {
            return rad * degrees;
          }

          function degrees2radian(deg) {
            return deg / degrees;
          }
        },
        {},
      ],
    },
    {},
    [2]
  )(2);
});
