import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  let auctions = Map.empty<Text, Nat>();
  let bids = Map.empty<Text, Nat>();
  let userProfiles = Map.empty<Principal, Nat>();

  let storage = Map.empty<Text, Storage.ExternalBlob>();

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
};
