//
//  Buffers.h
//  Flurry
//
//  Created by Satish on 5/7/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OpenGLES/ES2/glext.h>

#import "Constants.h"

@interface Buffers : NSObject
{
@public
    GLfloat positionData[NUMSMOKEPARTICLES * 4 * 2]; // Vertices
    GLushort indexData[NUMSMOKEPARTICLES * 6]; //Indices
    GLfloat colorData[NUMSMOKEPARTICLES * 4 * 4]; //Colors
    GLfloat uvData[NUMSMOKEPARTICLES * 4 * 2]; //Texture
}

@end
