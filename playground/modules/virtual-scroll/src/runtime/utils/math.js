const clamp = (value, min, max) => {
  if (min !== undefined && max !== undefined) {
    return Math.min(Math.max(value, min), max)
  } else if (min !== undefined) {
    return Math.max(value, min)
  } else if (max !== undefined) {
    return Math.min(value, max)
  } else {
    return value
  }
}

const lerp = (value, target, coeff, precision) => {
  if (Math.abs(target - value) < precision) { return target }

  return value * (1 - coeff) + target * coeff
}


export {lerp,clamp}
