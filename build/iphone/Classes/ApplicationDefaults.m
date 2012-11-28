/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"GVksnMOKdduoJfwnRrAABrn92SEPiKdp"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"GJ1D1Dq5MR7Ma6T1BY9zdu6ySGq6ZvYc"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"DuJgdOM0oLT9rdeSoICJa3PzwBzuFXRv"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"wTHq1H1aVZpS69dOVMG49YSmv5kSjTvn"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"tvUyLyTqDERujXIiA9oHrdITRFu4sFmu"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"yosfXpqyBGyVJeob7BTooFTqNJnws9lt"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
