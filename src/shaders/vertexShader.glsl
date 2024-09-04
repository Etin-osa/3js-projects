uniform float uTime;
attribute float aSpeed;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.x *= mod(aSpeed - uTime * 0.2, 2.0) + 0.7;
    modelPosition.z *= mod(aSpeed - uTime * 0.2, 2.0) + 0.7;

    // float yDistance = distance(vec2(modelPosition.x, modelPosition.z), vec2(0.0));
    // modelPosition.y += (3.0 - 5.0 * yDistance) * step(yDistance, 0.6);

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 8.0;
    gl_PointSize *= ( 1.0 / - viewPosition.z );
}